import { ElementHandle } from 'puppeteer';

import { OddButtonParser } from '../odd-button-parser';

export abstract class OddButton {
  protected readonly parentOddButtonParser: OddButtonParser;
  private wrappedButton: ElementHandle;
  private wrappedReferenceSelector: string | undefined;
  private wrappedReference: ElementHandle | undefined;
  private wrappedReferenceToButtonXPath: string | undefined;

  protected constructor({
    parentOddButtonParser,
    button,
  }: {
    parentOddButtonParser: OddButtonParser,
    button: ElementHandle,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.wrappedButton = button;
  }

  protected async init(): Promise<OddButton> {
    this.referenceSelector = await this.initReferenceSelector();
    this.reference = await this.initReference();
    return this;
  }

  protected abstract initReferenceSelector(): Promise<string>;

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

  public async resetFromReference(): Promise<ElementHandle> {
    const button = await this.reference.$(`xpath${this.referenceToButtonXPath}`);

    if (!button) {
      throw new Error(`button is null.`);
    }

    // Something verifying that the new button is in the right place. If not, should trigger refresh
    // of entire page followed by reset of all odd buttons. Might have to make this an abstract 
    // method and implement it in the child classes.

    this.button = button;
    return this.button
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