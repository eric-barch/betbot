import * as p from 'puppeteer';

import {
  OddButton,
  DataParser,
  DbGameConnection,
  DbOddConnection,
  DbStatisticConnection,
  PageParser,
} from '@/parsers';
import {
  OddButtonParser,
} from '@/parsers/models/shared-models/page-parser/odd-button-parser-set/odd-button-parser/odd-button-parser';
import {
  DraftKingsDbGameConnection,
  DraftKingsDbOddConnection,
  DraftKingsDbStatisticConnection,
} from './db-connections';

export class DraftKingsOddButtonParser extends OddButtonParser {
  public static async create({
    parentPageParser,
    button,
  }: {
    parentPageParser: PageParser,
    button: p.ElementHandle,
  }): Promise<DraftKingsOddButtonParser> {
    const draftKingsOddButtonParser = new DraftKingsOddButtonParser({
      parentPageParser,
      button,
    });
    await draftKingsOddButtonParser.init();
    return draftKingsOddButtonParser;
  }

  protected async initOddButton(): Promise<OddButton> {
    await this.oddButton.init({ referenceSelector: 'tr' });
    const foo = this.oddButton;
    return this.oddButton;
  }

  protected async initDbGame(): Promise<DbGameConnection> {
    this.dbGame = await DraftKingsDbGameConnection.create({ parentOddButtonParser: this });
    return this.dbGame;
  }

  protected async initDbStatistic(): Promise<DbStatisticConnection> {
    this.dbStatistic = await DraftKingsDbStatisticConnection.create({ parentOddButtonParser: this });
    return this.dbStatistic;
  }

  protected async initDbOdd(): Promise<DbOddConnection> {
    this.dbOdd = await DraftKingsDbOddConnection.create({ parentOddButtonParser: this });
    return this.dbOdd;
  }

  protected async initPriceParser(): Promise<DataParser> {
    this.priceParser = await DataParser.create({
      parentOddButtonParser: this,
      selector: '.sportsbook-outcome-cell__elements',
    });

    return this.priceParser;
  }

  protected async initValueParser(): Promise<DataParser> {
    this.valueParser = await DataParser.create({
      parentOddButtonParser: this,
      selector: '.sportsbook-outcome-cell__label-line-container',
    });

    return this.valueParser;
  }

  public async updateOddData(): Promise<DraftKingsOddButtonParser> {
    await this.oddButton.updateOddButton();
    await this.initPriceParser();
    await this.initValueParser();
    await this.updateDbOddFromDataParsers();
    return this;
  }
}