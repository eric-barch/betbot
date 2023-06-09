import * as p from 'puppeteer';
import { OddButtonParser } from '../odd-button-parser';

export class OddButton {
  private parentOddButtonParser: OddButtonParser;
  private wrappedButton: p.ElementHandle;
  private wrappedReferenceSelector: string | undefined;
  private wrappedReference: p.ElementHandle | undefined;
  private wrappedReferenceToButtonXPath: string | undefined;

  public constructor({
    parentOddButtonParser,
    button,
  }: {
    parentOddButtonParser: OddButtonParser,
    button: p.ElementHandle,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.wrappedButton = button;
  }

  public async init({
    referenceSelector,
  }: {
    referenceSelector: string,
  }): Promise<OddButton> {
    this.referenceSelector = referenceSelector;
    await this.initReference();
    console.log('Reference initialized.');
    return this;
  }

  private async initReference(): Promise<p.ElementHandle> {
    let element = this.parentOddButtonParser.button;
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

      if (!(elementProperty instanceof p.ElementHandle)) {
        throw new Error(`elementProperty is not ElementHandle.`);
      }

      element = elementProperty;
    }

    throw new Error(`Did not find parent with matching selector.`);
  }

  private async getElementTagWithIndex({
    element,
  }: {
    element: p.ElementHandle,
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

  public async updateOddButton(): Promise<p.ElementHandle> {
    const button = await this.reference.$(`xpath${this.referenceToButtonXPath}`);

    const className = await (await button?.getProperty('className'))?.jsonValue();

    if (!button) {
      throw new Error(`button is null.`);
    }

    this.button = button;
    return this.button
  }

  private set button(button: p.ElementHandle) {
    this.wrappedButton = button;
  }

  public get button(): p.ElementHandle {
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

  private set reference(reference: p.ElementHandle) {
    this.wrappedReference = reference;
  }

  private get reference(): p.ElementHandle {
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