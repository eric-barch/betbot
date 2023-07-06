import { ElementHandle } from 'puppeteer';

import { OddButtonParser } from '@/parsers/models/common-models';

export abstract class OddButtonWrapper {
  public readonly parent: OddButtonParser;
  private wrappedOddButton: ElementHandle;
  private wrappedReferenceSelector: string | undefined;
  private wrappedReference: ElementHandle | undefined;
  private wrappedReferenceToOddButtonXPath: string | undefined;

  protected constructor({
    parent,
    oddButton,
  }: {
    parent: OddButtonParser,
    oddButton: ElementHandle,
  }) {
    this.parent = parent;
    this.wrappedOddButton = oddButton;
  }

  protected async init(): Promise<OddButtonWrapper> {
    this.referenceSelector = await this.generateReferenceSelector();
    this.reference = await this.getReferenceElement();
    return this;
  }

  protected abstract generateReferenceSelector(): Promise<string>;

  private async getReferenceElement(): Promise<ElementHandle> {
    this.referenceToOddButtonXPath = '';

    let element = this.oddButton;

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
      this.referenceToOddButtonXPath = elementTagWithIndex + this.referenceToOddButtonXPath;


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
    const button = await this.reference.$(`xpath${this.referenceToOddButtonXPath}`);

    if (!button) {
      throw new Error(`button is null.`);
    }

    this.oddButton = button;

    const oddButtonPositionVerified = await this.verifyOddButtonPosition();

    if (!oddButtonPositionVerified) {
      throw new Error(`Odd button position failed verification.`);
    }

    return this.oddButton
  }

  protected abstract verifyOddButtonPosition(): Promise<boolean>;

  public get oddButton(): ElementHandle {
    if (!this.wrappedOddButton) {
      throw new Error(`wrappedOddButton is undefined.`);
    }

    return this.wrappedOddButton;
  }

  public get reference(): ElementHandle {
    if (!this.wrappedReference) {
      throw new Error(`wrappedReferenceElement is undefined.`);
    }

    return this.wrappedReference;
  }

  private set oddButton(oddButton: ElementHandle) {
    this.wrappedOddButton = oddButton;
  }

  private set reference(referenceElement: ElementHandle) {
    this.wrappedReference = referenceElement;
  }

  protected set referenceSelector(referenceSelector: string) {
    this.wrappedReferenceSelector = referenceSelector;
  }

  protected get referenceSelector(): string {
    if (this.wrappedReferenceSelector === undefined) {
      throw new Error(`wrappedReferenceSelector is undefined.`);
    }

    return this.wrappedReferenceSelector;
  }

  private set referenceToOddButtonXPath(referenceToOddButtonXPath: string) {
    this.wrappedReferenceToOddButtonXPath = referenceToOddButtonXPath;
  }

  private get referenceToOddButtonXPath(): string {
    if (this.wrappedReferenceToOddButtonXPath === undefined) {
      throw new Error(`wrappedReferenceToOddButtonXPath is undefined.`);
    }

    return this.wrappedReferenceToOddButtonXPath;
  }
}