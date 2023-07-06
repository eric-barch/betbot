import { ElementHandle } from 'puppeteer';

import {
  DbGameConnection, DbStatisticConnection, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  PageParser, SpecializedDbStatisticConnection,
} from '@/parsers/models/common-models';
import { DraftKingsParserFactory, FanDuelParserFactory } from '@/parsers/models/specialized-models';

export abstract class ParserFactory {
  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<ParserFactory> {
    switch (parentPageParser.exchange.name) {
      case 'DraftKings':
        return new DraftKingsParserFactory();
      case 'FanDuel':
        return new FanDuelParserFactory();
      default:
        throw new Error(`No specialized parser factory found for exchange ` +
          `${parentPageParser.exchange.name}`);
    }
  }

  abstract createOddButtonParserSet({
    parent,
  }: {
    parent: PageParser,
  }): Promise<OddButtonParserSet>;

  abstract createOddButtonWrapper({
    parent,
    oddButton,
  }: {
    parent: OddButtonParser,
    oddButton: ElementHandle,
  }): Promise<OddButtonWrapper>;

  abstract createDbGameConnection({
    parent,
  }: {
    parent: OddButtonParser,
  }): Promise<DbGameConnection>;

  abstract createDbStatisticConnection({
    parentDbStatisticConnection,
  }: {
    parentDbStatisticConnection: DbStatisticConnection,
  }): Promise<SpecializedDbStatisticConnection>;
}