import { OddButtonParserSet, SpecializedOddButtonParserSet } from '@/parsers/models/common-models';

export class FanDuelOddButtonParserSet implements SpecializedOddButtonParserSet {
  private readonly parentOddButtonParserSet: OddButtonParserSet;

  public constructor({
    parentOddButtonParserSet,
  }: {
    parentOddButtonParserSet: OddButtonParserSet,
  }) {
    this.parentOddButtonParserSet = parentOddButtonParserSet;
  }

  /**TODO: Consider having the oddButtonSelector be a synchronously fetchable property on the 
   * OddButtonParserSet, determined as part of an asynchronous instantiation. */
  public async generateOddButtonSelector(): Promise<string> {
    const page = this.parentOddButtonParserSet.parentPageParser.page;
    const buttons = await page.$$('div[role="button"]');

    const classNames = new Set<string>;

    for (const button of buttons) {
      const className = await button.evaluate(el => el.className);
      classNames.add(className);
    }

    /**TODO: Select the two class names that are obviously different than the others, find the 
     * common classes between them, and return that set of classes as the odd button 
     * selector. */

    throw new Error(`Finish implementing.`);
  }
}