import { Exchange, League } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { CommonOddButtonParser, SpecializedOddButtonParser } from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/odd-button-parser';
import { DraftKingsDbGameInitializer, DraftKingsDbStatisticInitializer, DraftKingsOddButton } from '@/parsers/models/exchange-models/draft-kings';
import { DbOddInitializer, PageParser } from '@/parsers/models/common-models';

export class DraftKingsOddButtonParser implements SpecializedOddButtonParser {
  public readonly parentPageParser: PageParser;
  private wrappedCommonOddButtonParser: CommonOddButtonParser | undefined;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
  }

  public static async create({
    parentPageParser,
    button,
  }: {
    parentPageParser: PageParser,
    button: ElementHandle,
  }): Promise<DraftKingsOddButtonParser> {
    const draftKingsOddButtonParser = new DraftKingsOddButtonParser({
      parentPageParser,
    });

    draftKingsOddButtonParser.oddButton = await DraftKingsOddButton.create({
      parentOddButtonParser: draftKingsOddButtonParser,
      button,
    });
    draftKingsOddButtonParser.dbGameInitializer = await DraftKingsDbGameInitializer.create({
      parentOddButtonParser: draftKingsOddButtonParser,
    });
    draftKingsOddButtonParser.dbStatisticInitializer = await DraftKingsDbStatisticInitializer.create({
      parentOddButtonParser: draftKingsOddButtonParser,
    });
    draftKingsOddButtonParser.dbOddInitializer = await DbOddInitializer.create({
      parentOddButtonParser: draftKingsOddButtonParser,
    });

    await draftKingsOddButtonParser.updateDbOddFromTextContent();

    return draftKingsOddButtonParser;
  }

  private async init() {
    this.commonOddButtonParser = await CommonOddButtonParser.create({
      parentPageParser: this.parentPageParser,
      button: this.button,
    });
  }

  public async updateOdd(): Promise<DraftKingsOddButtonParser> {
    await this.oddButton.resetFromReference();
    await this.updateDbOddFromTextContent();
    return this;
  }
}