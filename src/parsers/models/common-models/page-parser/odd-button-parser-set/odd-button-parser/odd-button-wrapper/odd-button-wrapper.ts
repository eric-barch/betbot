import { ElementHandle } from 'puppeteer';

import { GameWithTeams } from '@/db';
import { OddButtonParser } from '@/parsers/models/common-models';

export interface SpecializedOddButtonWrapper {
  generateReferenceSelector(): Promise<string>;
  verifyOddButtonPosition(): Promise<boolean>;
}

export class OddButtonWrapper {
  private readonly parentOddButtonParser: OddButtonParser;
  private wrappedOddButton: ElementHandle;
  private wrappedSpecializedOddButtonWrapper: SpecializedOddButtonWrapper | undefined;
  private wrappedReferenceSelector: string | undefined;
  private wrappedReferenceElement: ElementHandle | undefined;
  private wrappedReferenceElementToOddButtonXPath: string | undefined;

  private constructor({
    parentOddButtonParser,
    oddButton,
  }: {
    parentOddButtonParser: OddButtonParser,
    oddButton: ElementHandle,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.wrappedOddButton = oddButton;
  }

  public static async create({
    parentOddButtonParser,
    oddButton,
  }: {
    parentOddButtonParser: OddButtonParser,
    oddButton: ElementHandle,
  }): Promise<OddButtonWrapper> {
    const oddButtonWrapper = new OddButtonWrapper({
      parentOddButtonParser,
      oddButton,
    });
    await oddButtonWrapper.init();
    return oddButtonWrapper;
  }

  private async init(): Promise<OddButtonWrapper> {
    this.specializedOddButtonWrapper = await this
      .parentOddButtonParser
      .parentPageParser
      .specializedParserFactory
      .createOddButtonWrapper({
        parentOddButtonWrapper: this,
      });
    this.referenceSelector = await this.specializedOddButtonWrapper.generateReferenceSelector();
    this.referenceElement = await this.getReferenceElement();
    return this;
  }

  private async getReferenceElement(): Promise<ElementHandle> {
    this.referenceElementToOddButtonXPath = '';

    let element = this.oddButton;

    // TODO: Can probably simplify this using evaluateHandle -> closest
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

  public get oddButton(): ElementHandle {
    if (!this.wrappedOddButton) {
      throw new Error(`wrappedOddButton is undefined.`);
    }

    return this.wrappedOddButton;
  }

  public get referenceElement(): ElementHandle {
    if (!this.wrappedReferenceElement) {
      throw new Error(`wrappedReferenceElement is undefined.`);
    }

    return this.wrappedReferenceElement;
  }

  public get game(): GameWithTeams {
    return this.parentOddButtonParser.game;
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

  private set referenceSelector(referenceSelector: string) {
    this.wrappedReferenceSelector = referenceSelector;
  }

  private get referenceSelector(): string {
    if (!this.wrappedReferenceSelector) {
      throw new Error(`wrappedReferenceSelector is undefined.`);
    }

    return this.wrappedReferenceSelector;
  }

  private set referenceElement(referenceElement: ElementHandle) {
    this.wrappedReferenceElement = referenceElement;
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