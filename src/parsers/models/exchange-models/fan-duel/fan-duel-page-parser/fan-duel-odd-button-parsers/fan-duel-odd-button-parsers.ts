import { ElementHandle } from 'puppeteer';

import { PageParser, OddButtonParser } from '@/parsers/models/common-models';
import { CommonOddButtonParserSet, IOddButtonParserSet } from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser-set';
import { FanDuelOddButtonParser } from '@/parsers/models/exchange-models/fan-duel';

export class FanDuelOddButtonParserSet implements IOddButtonParserSet {
  private wrappedCommonOddButtonParserSet: CommonOddButtonParserSet | undefined;
  private wrappedOddButtonParsers: Set<FanDuelOddButtonParser> | undefined;

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<FanDuelOddButtonParserSet> {
    const fanDuelOddButtonParserSet = new FanDuelOddButtonParserSet();

    fanDuelOddButtonParserSet.commonOddButtonParserSet = await CommonOddButtonParserSet.create({
      parentPageParser,
      parentOddButtonParserSet: fanDuelOddButtonParserSet,
    });

    fanDuelOddButtonParserSet.oddButtonParsers = await fanDuelOddButtonParserSet.createOddButtonParsers();

    return fanDuelOddButtonParserSet;
  }

  public async generateOddButtonSelector(): Promise<string> {
    const page = this.commonOddButtonParserSet.page;
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

    return `.${oddButtonClasses.join('.')}`;
  }

  public async createOddButtonParsers(): Promise<Set<OddButtonParser>> {
    this.oddButtonParsers = new Set<FanDuelOddButtonParser>();

    // Run in series (development)
    for (const button of this.commonOddButtonParserSet.buttons) {
      const fanDuelOddButtonParser = await FanDuelOddButtonParser.create({
        exchange: this.commonOddButtonParserSet.exchange,
        league: this.commonOddButtonParserSet.league,
        button: button,
      });
      this.oddButtonParsers.add(fanDuelOddButtonParser);
    }

    // Run in parallel (production)
    // await Promise.all(
    //   this.buttons.map(async (button) => {
    //     const draftKingsOddButtonParser = await DraftKingsOddButtonParser.create({
    //       exchange: this.commonOddButtonParserSet.exchange,
    //       league: this.commonOddButtonParserSet.league,
    //       button: button,
    //     });
    //     this.oddButtonParsers.add(draftKingsOddButtonParser);
    //   })
    // );

    return this.oddButtonParsers;
  }

  public async updateOdds(): Promise<void> {
    await this.commonOddButtonParserSet.updateOdds();
  }

  private set commonOddButtonParserSet(commonOddButtonParserSet: CommonOddButtonParserSet) {
    this.wrappedCommonOddButtonParserSet = commonOddButtonParserSet;
  }

  private get commonOddButtonParserSet(): CommonOddButtonParserSet {
    if (!this.wrappedCommonOddButtonParserSet) {
      throw new Error(`commonOddButtonParserSet is not defined.`);
    }

    return this.wrappedCommonOddButtonParserSet;
  }

  private set oddButtonParsers(oddButtonParsers: Set<FanDuelOddButtonParser>) {
    this.wrappedOddButtonParsers = oddButtonParsers;
  }

  public get oddButtonParsers(): Set<FanDuelOddButtonParser> {
    if (!this.wrappedOddButtonParsers) {
      throw new Error(`oddButtonParsers is not defined.`);
    }

    return this.wrappedOddButtonParsers;
  }
}
