import { ElementHandle } from 'puppeteer';

import { OddButtonParser, ParserFactory } from '@/parsers/models/common-models';

export interface SpecializedOddButtonWrapper {
  generateReferenceSelector(): Promise<string>;
  confirmCorrectOddButtonPosition(): Promise<boolean>;
}

export class OddButtonWrapper {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly parserFactory: ParserFactory;
  private wrappedSpecializedOddButtonWrapper: SpecializedOddButtonWrapper | undefined;
  private wrappedButton: ElementHandle;
  private wrappedReferenceSelector: string | undefined;
  private wrappedReference: ElementHandle | undefined;
  private wrappedReferenceToButtonXPath: string | undefined;

  private constructor({
    parentOddButtonParser,
    parserFactory,
    initializationButton,
  }: {
    parentOddButtonParser: OddButtonParser,
    parserFactory: ParserFactory,
    initializationButton: ElementHandle,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.parserFactory = parserFactory;
    this.wrappedButton = initializationButton;
  }

  public static async create({
    parentOddButtonParser,
    parserFactory,
    initializationButton,
  }: {
    parentOddButtonParser: OddButtonParser,
    parserFactory: ParserFactory,
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
    let element = this.button;
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

    const correctOddButtonPosition = await this.specializedOddButtonWrapper.confirmCorrectOddButtonPosition();

    if (!correctOddButtonPosition) {
      throw new Error(`Odd button is not in correct position.`);
    }

    this.button = button;
    return this.button
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

  private set button(button: ElementHandle) {
    this.wrappedButton = button;
  }

  public get button(): ElementHandle {
    if (!this.wrappedButton) {
      throw new Error(`wrappedButton is undefined.`);
    }

    return this.wrappedButton;
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

  private get reference(): ElementHandle {
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