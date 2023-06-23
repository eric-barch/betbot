import { ElementHandle } from 'puppeteer';

import { OddButtonParser, ParserFactory, SpecializedParserFactory } from '@/parsers/models/common-models';

export interface SpecializedOddButtonWrapper {
  generateReferenceSelector(): Promise<string>;
  confirmOddButtonPosition(): Promise<boolean>;
}

export class OddButtonWrapper {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly parserFactory: SpecializedParserFactory;
  private wrappedSpecializedOddButtonWrapper: SpecializedOddButtonWrapper | undefined;
  private wrappedOddButton: ElementHandle;
  private wrappedReferenceSelector: string | undefined;
  private wrappedReference: ElementHandle | undefined;
  private wrappedReferenceToButtonXPath: string | undefined;

  private constructor({
    parentOddButtonParser,
    parserFactory,
    initializationButton,
  }: {
    parentOddButtonParser: OddButtonParser,
    parserFactory: SpecializedParserFactory,
    initializationButton: ElementHandle,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.parserFactory = parserFactory;
    this.wrappedOddButton = initializationButton;
  }

  public static async create({
    parentOddButtonParser,
    parserFactory,
    initializationButton,
  }: {
    parentOddButtonParser: OddButtonParser,
    parserFactory: SpecializedParserFactory,
    initializationButton: ElementHandle,
  }): Promise<OddButtonWrapper> {
    const oddButtonWrapper = new OddButtonWrapper({
      parentOddButtonParser,
      parserFactory,
      initializationButton,
    });
    await oddButtonWrapper.init();
    return oddButtonWrapper;
  }

  protected async init(): Promise<OddButtonWrapper> {
    this.specializedOddButtonWrapper = await this.parserFactory.createOddButtonWrapper({
      parentOddButtonParser: this.parentOddButtonParser,
      parentOddButtonWrapper: this,
    });

    this.referenceSelector = await this.specializedOddButtonWrapper.generateReferenceSelector();
    this.reference = await this.initReference();

    return this;
  }

  private async initReference(): Promise<ElementHandle> {
    let element = this.oddButton;
    this.referenceToButtonXPath = '';

    while (element) {
      const matchesSelector = await element.evaluate(
        (el, selector) => el.matches(selector),
        this.referenceSelector,
      );

      if (matchesSelector) {
        this.reference = element;
        return this.reference;
      }

      const elementTagWithIndex = await this.getElementTagWithIndex({ element });
      this.referenceToButtonXPath = elementTagWithIndex + this.referenceToButtonXPath;

      const elementProperty = await element.getProperty('parentElement');

      if (!(elementProperty instanceof ElementHandle)) {
        throw new Error(`elementProperty is not ElementHandle.`);
      }

      element = elementProperty;
    }

    throw new Error(`Did not find parent with matching selector.`);
  }

  private async getElementTagWithIndex({
    element,
  }: {
    element: ElementHandle,
  }): Promise<string> {
    const { tag, index } = await element.evaluate(el => {
      const tag = el.tagName.toLowerCase();
      const parent = el.parentElement;
      if (parent === null) {
        throw new Error('Element does not have a parent.');
      }

      const siblings = Array.from(parent.children);
      const siblingsOfSameTag = siblings.filter(sibling => sibling.tagName.toLowerCase() === tag);
      const index = siblingsOfSameTag.indexOf(el) + 1;

      return { tag, index };
    });

    return `/${tag}[${index}]`;
  }

  public async resetOddButtonFromReference(): Promise<ElementHandle> {
    const button = await this.reference.$(`xpath${this.referenceToButtonXPath}`);

    if (!button) {
      throw new Error(`button is null.`);
    }

    this.oddButton = button;

    const oddButtonPositionIsConfirmed = await this.specializedOddButtonWrapper.confirmOddButtonPosition();

    if (!oddButtonPositionIsConfirmed) {
      throw new Error(`Odd button position is not confirmed.`);
    }

    return this.oddButton
  }

  private set specializedOddButtonWrapper(specializedOddButtonWrapper: SpecializedOddButtonWrapper) {
    this.wrappedSpecializedOddButtonWrapper = specializedOddButtonWrapper;
  }

  private get specializedOddButtonWrapper(): SpecializedOddButtonWrapper {
    if (!this.wrappedSpecializedOddButtonWrapper) {
      throw new Error(`wrappedSpecializedOddButtonWrapper is undefined.`);
    }

    return this.wrappedSpecializedOddButtonWrapper;
  }

  private set oddButton(oddButton: ElementHandle) {
    this.wrappedOddButton = oddButton;
  }

  public get oddButton(): ElementHandle {
    if (!this.wrappedOddButton) {
      throw new Error(`wrappedOddButton is undefined.`);
    }

    return this.wrappedOddButton;
  }

  protected set referenceSelector(referenceSelector: string) {
    this.wrappedReferenceSelector = referenceSelector;
  }

  protected get referenceSelector(): string {
    if (!this.wrappedReferenceSelector) {
      throw new Error(`wrappedReferenceSelector is undefined.`);
    }

    return this.wrappedReferenceSelector;
  }

  private set reference(reference: ElementHandle) {
    this.wrappedReference = reference;
  }

  public get reference(): ElementHandle {
    if (!this.wrappedReference) {
      throw new Error(`wrappedReference is undefined.`);
    }

    return this.wrappedReference;
  }

  private set referenceToButtonXPath(referenceToButtonXPath: string) {
    this.wrappedReferenceToButtonXPath = referenceToButtonXPath;
  }

  private get referenceToButtonXPath(): string {
    if (this.wrappedReferenceToButtonXPath === undefined) {
      throw new Error(`wrappedReferenceToButtonXPath is undefined.`);
    }

    return this.wrappedReferenceToButtonXPath;
  }
}