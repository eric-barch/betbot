import { ElementHandle } from 'puppeteer';

import { FanDuelPageParser, FanDuelOddButtonParser } from '@/parsers/models/exchange-models/fan-duel';
import { OddButtonParser, OddButtonParsers } from '@/parsers/models/shared-models';

export class FanDuelOddButtonParsers extends OddButtonParsers {
  protected wrappedOddButtonSelector: string | undefined;

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: FanDuelPageParser;
  }): Promise<FanDuelOddButtonParsers> {
    const fanDuelOddButtonParserSet = new FanDuelOddButtonParsers({ parentPageParser });
    await fanDuelOddButtonParserSet.setOddButtonSelector();
    await fanDuelOddButtonParserSet.init();
    return fanDuelOddButtonParserSet;
  }

  protected async setOddButtonSelector(): Promise<string> {
    const page = this.parentPageParser.page;
    const allButtons = await page.$$(`[role="button"]`);

    let firstOddButton: ElementHandle | undefined;
    let secondOddButton: ElementHandle | undefined;

    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i];
      const ariaLabel = await (await button.getProperty('ariaLabel')).jsonValue();

      if (!ariaLabel) {
        throw new Error(`ariaLabel is null.`);
      }

      if (!(ariaLabel.toLowerCase().startsWith('tab'))) {
        firstOddButton = button;
        secondOddButton = allButtons[i + 1];
        break;
      }
    }

    if ((!firstOddButton) || (!secondOddButton)) {
      throw new Error(`An oddButton is undefined.`);
    }

    const firstOddButtonClassName = await (await firstOddButton.getProperty('className')).jsonValue();
    const secondOddButtonClassName = await (await secondOddButton.getProperty('className')).jsonValue();

    const firstOddButtonClasses = firstOddButtonClassName.split(' ');
    const secondOddButtonClasses = secondOddButtonClassName.split(' ');

    let oddButtonClasses = new Array<string>();

    for (let i = 0; i < firstOddButtonClasses.length; i++) {
      const firstOddButtonClass = firstOddButtonClasses[i];
      const secondOddButtonClass = secondOddButtonClasses[i];

      if (firstOddButtonClass === secondOddButtonClass) {
        oddButtonClasses.push(firstOddButtonClass);
      } else {
        break;
      }
    }

    if (oddButtonClasses.length < 1) {
      throw new Error(`oddButtonClasses is empty.`);
    }

    this.oddButtonSelector = `.${oddButtonClasses.join('.')}`;
    return this.oddButtonSelector;
  }

  protected async createOddButtonParsers(): Promise<Set<OddButtonParser>> {
    for (const button of this.buttons) {
      const fanDuelOddButtonParser = await FanDuelOddButtonParser.create({
        exchange: this.parentPageParser.exchange,
        league: this.parentPageParser.league,
        button: button,
      });

      this.oddButtonParsers.add(fanDuelOddButtonParser);
    }

    return this.oddButtonParsers;
  }
}