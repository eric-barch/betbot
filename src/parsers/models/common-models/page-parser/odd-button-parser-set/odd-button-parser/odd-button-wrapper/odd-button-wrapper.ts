import { ElementHandle } from 'puppeteer';

import { OddButtonParser, SpecializedParserFactory } from '@/parsers/models/common-models';

export interface SpecializedOddButtonWrapper {
  generateReferenceSelector(): Promise<string>;
  verifyOddButtonPosition(): Promise<boolean>;
}

export class OddButtonWrapper {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly specializedParserFactory: SpecializedParserFactory;
  private wrappedOddButton: ElementHandle;
  private wrappedSpecializedOddButtonWrapper: SpecializedOddButtonWrapper | undefined;
  private wrappedReferenceSelector: string | undefined;
  private wrappedReferenceElement: ElementHandle | undefined;
  private wrappedReferenceElementToOddButtonXPath: string | undefined;

  private constructor({
    parentOddButtonParser,
    specializedParserFactory,
    initializationButton,
  }: {
    parentOddButtonParser: OddButtonParser,
    specializedParserFactory: SpecializedParserFactory,
    initializationButton: ElementHandle,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.specializedParserFactory = specializedParserFactory;
    this.wrappedOddButton = initializationButton;
  }

  public static async create({
    parentOddButtonParser,
    specializedParserFactory,
    initializationButton,
  }: {
    parentOddButtonParser: OddButtonParser,
    specializedParserFactory: SpecializedParserFactory,
    initializationButton: ElementHandle,
  }): Promise<OddButtonWrapper> {
    const oddButtonWrapper = new OddButtonWrapper({
      parentOddButtonParser,
      specializedParserFactory,
      initializationButton,
    });
    await oddButtonWrapper.init();
    return oddButtonWrapper;
  }

  private async init(): Promise<OddButtonWrapper> {
    this.specializedOddButtonWrapper = await this.specializedParserFactory.createOddButtonWrapper({
      parentOddButtonParser: this.parentOddButtonParser,
      parentOddButtonWrapper: this,
    });
    this.referenceSelector = await this.specializedOddButtonWrapper.generateReferenceSelector();
    this.referenceElement = await this.findReferenceElement();
    return this;
  }

  private async findReferenceElement(): Promise<ElementHandle> {
    this.referenceElementToOddButtonXPath = '';

    let element = this.oddButton;

    while (element) {
      const matchesSelector = await element.evaluate(
        (el, selector) => el.matches(selector),
        this.referenceSelector,
      );

      if (matchesSelector) {
        this.referenceElement = element;
        return this.referenceElement;
      }

      const elementTagWithIndex = await this.getElementTagWithIndex({ element });
      this.referenceElementToOddButtonXPath = elementTagWithIndex + this.referenceElementToOddButtonXPath;

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

  public async resetFromReference(): Promise<ElementHandle> {
    // TODO: If there is anywhere to gain some consistent performance it's probably here
    const button = await this.referenceElement.$(`xpath${this.referenceElementToOddButtonXPath}`);

    if (!button) {
      throw new Error(`button is null.`);
    }

    this.oddButton = button;

    const oddButtonPositionVerified = await this.specializedOddButtonWrapper.verifyOddButtonPosition();

    if (!oddButtonPositionVerified) {
      throw new Error(`Odd button position failed verification.`);
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

  private set referenceElement(referenceElement: ElementHandle) {
    this.wrappedReferenceElement = referenceElement;
  }

  public get referenceElement(): ElementHandle {
    if (!this.wrappedReferenceElement) {
      throw new Error(`wrappedReferenceElement is undefined.`);
    }

    return this.wrappedReferenceElement;
  }

  private set referenceElementToOddButtonXPath(referenceToButtonXPath: string) {
    this.wrappedReferenceElementToOddButtonXPath = referenceToButtonXPath;
  }

  private get referenceElementToOddButtonXPath(): string {
    if (this.wrappedReferenceElementToOddButtonXPath === undefined) {
      throw new Error(`wrappedReferenceToButtonXPath is undefined.`);
    }

    return this.wrappedReferenceElementToOddButtonXPath;
  }
}