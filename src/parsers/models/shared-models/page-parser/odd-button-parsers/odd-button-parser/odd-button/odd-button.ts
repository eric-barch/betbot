import { ElementHandle } from 'puppeteer';

export class OddButton {
  private wrappedButton: ElementHandle;
  private wrappedReferenceSelector: string | undefined;
  private wrappedReference: ElementHandle | undefined;
  private wrappedReferenceToButtonXPath: string | undefined;

  public constructor({
    button,
  }: {
    button: ElementHandle,
  }) {
    this.wrappedButton = button;
  }

  public async init({
    referenceSelector,
  }: {
    referenceSelector: string,
  }): Promise<OddButton> {
    this.referenceSelector = referenceSelector;
    await this.initReference();
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

  public async updateOddButton(): Promise<ElementHandle> {
    const button = await this.reference.$(`xpath${this.referenceToButtonXPath}`);

    if (!button) {
      throw new Error(`button is null.`);
    }

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

  private set referenceSelector(referenceSelector: string) {
    this.wrappedReferenceSelector = referenceSelector;
  }

  private get referenceSelector(): string {
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