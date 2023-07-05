import { ElementHandle } from 'puppeteer';

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

    const classNames = new Set<string>();

    for (const button of buttons) {
      const className = (await button.evaluate(el => el.className));
      classNames.add(className);
    }

    const oddButtonClassNames = new Array<string>();

    for (const className of classNames) {
      const classes = className.split(' ');
      const firstElement = (await page.$(`div.${classes.join('.')}`))!;

      if (await this.isOddButton({ element: firstElement })) {
        oddButtonClassNames.push(className);
      }
    }

    const commonClasses = this.getCommonClasses({ oddButtonClassNames });
    const oddButtonSelectorClasses = commonClasses.slice(0, 5);
    const oddButtonSelector = `div.${oddButtonSelectorClasses.join('.')}`

    return oddButtonSelector;
  }

  private async isOddButton({
    element,
  }: {
    element: ElementHandle,
  }): Promise<boolean> {
    const ariaLabel = (await element.evaluate(el => el.ariaLabel));

    if (!ariaLabel) {
      return false;
    }

    const oddKeywords = new Array<string>(
      'run line',
      'moneyline',
      'total runs',
    )

    if (oddKeywords.some(oddKeyword => ariaLabel.toLowerCase().includes(oddKeyword))) {
      return true;
    }

    return false;
  }

  private getCommonClasses({
    oddButtonClassNames,
  }: {
    oddButtonClassNames: Array<string>,
  }): Array<string> {
    const classArrays = oddButtonClassNames.map(oddButtonClassName => oddButtonClassName.split(' '));

    let commonClasses = classArrays[0];

    for (let i = 1; i < classArrays.length; i++) {
      commonClasses = commonClasses.filter(cls => classArrays[i].includes(cls));
    }

    return commonClasses;
  }
}