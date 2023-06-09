import * as p from 'puppeteer';

import { OddButtonParser } from '@/parsers/models/shared-models/page-parser/odd-button-parser-set/odd-button-parser/odd-button-parser';
import {
  PageParser, DbGameConnection, DbStatisticConnection, DbOddConnection, DataParser,
} from '@/parsers';
import {
  DraftKingsDbGameConnection, DraftKingsDbStatisticConnection, DraftKingsDbOddConnection,
} from './db-connections';

export class DraftKingsOddButtonParser extends OddButtonParser {
  public static async create({
    parentPageParser,
    buttonElement,
  }: {
    parentPageParser: PageParser,
    buttonElement: p.ElementHandle,
  }): Promise<DraftKingsOddButtonParser> {
    const draftKingsOddButtonParser = new DraftKingsOddButtonParser({
      parentPageParser,
      buttonElement,
    });
    await draftKingsOddButtonParser.init();
    return draftKingsOddButtonParser;
  }

  protected async initDbGameConnection(): Promise<DbGameConnection> {
    this.dbGameConnection = await DraftKingsDbGameConnection.create({ parentOddButtonParser: this });
    return this.dbGameConnection;
  }

  protected async initDbStatisticConnection(): Promise<DbStatisticConnection> {
    this.dbStatisticConnection = await DraftKingsDbStatisticConnection.create({ parentOddButtonParser: this });
    return this.dbStatisticConnection;
  }

  protected async initDbOddConnection(): Promise<DbOddConnection> {
    this.dbOddConnection = await DraftKingsDbOddConnection.create({ parentOddButtonParser: this });
    return this.dbOddConnection;
  }

  protected async initPriceParser(): Promise<DataParser> {
    this.priceParser = await DataParser.create({
      parentOddButtonParser: this,
      selector: '.sportsbook-outcome-cell__label-line-container',
    });
    return this.priceParser;
  }

  protected async initValueParser(): Promise<DataParser> {
    this.valueParser = await DataParser.create({
      parentOddButtonParser: this,
      selector: '.sportsbook-outcome-cell__elements',
    });
    return this.valueParser;
  }
}