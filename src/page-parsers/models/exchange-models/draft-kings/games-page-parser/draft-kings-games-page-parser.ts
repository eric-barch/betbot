import * as p from 'puppeteer';

import { PageParserInitData } from '@/init-data';
import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { JsonGamesParser } from './json-games-parser';
import { OddHandle } from '@/page-parsers';
import { Game, Statistic } from '@prisma/client';
import { DbUtilityFunctions } from '@/db';

export class DraftKingsGamesPageParser extends PageParser {
  private jsonGamesParser: JsonGamesParser;

  constructor({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }) {
    super({ pageParserInitData });
    this.jsonGamesParser = new JsonGamesParser({ pageParser: this });
  }

  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<DraftKingsGamesPageParser> {
    const pageParser = new DraftKingsGamesPageParser({ pageParserInitData });
    await pageParser.init();
    await pageParser.jsonGamesParser.ensureGamesInDb();
    await pageParser.initOddHandles();
    return pageParser;
  }

  protected async initOddHandles(): Promise<Set<OddHandle>> {
    const buttonElements = await this.page.$$('div[role="button"].sportsbook-outcome-cell__body');

    for (const buttonElement of buttonElements) {
      const exchange = this.exchange;
      // const statistic = this.getDbStatistic({ buttonElement });

      const valueElement = await buttonElement.$('.sportsbook-outcome-cell__label-line-container');
      const priceElement = await buttonElement.$('.sportsbook-outcome-cell__elements');

      if (!priceElement) {
        throw new Error(`priceElement is null.`);
      }

      const oddHandle = new OddHandle({
        buttonElement,
        valueElement,
        priceElement,
      });

      this.oddHandles.add(oddHandle);
    }

    return this.oddHandles;
  }

  private async getDbGame({
    buttonElement,
  }: {
    buttonElement: p.ElementHandle;
  }): Promise<Game> {
    const exchange = this.exchange;
    const exchangeAssignedGameId = await this.getExchangeAssignedId({ buttonElement });

    const game = await DbUtilityFunctions.findDbGameByExchangeAssignedId({
      exchange: exchange,
      exchangeAssignedGameId,
    });

    return game;
  }

  private async getExchangeAssignedId({
    buttonElement,
  }: {
    buttonElement: p.ElementHandle,
  }): Promise<string> {
    const dataTracking: string = await buttonElement.evaluate(el => el.getAttribute('data-tracking') || '');
    const parsedDataTracking = JSON.parse(dataTracking);
    const eventId: string = parsedDataTracking.eventId;
    return eventId;
  }

  protected async updateOddHandles(): Promise<Array<OddHandle>> {
    return new Array<OddHandle>;
  }


}