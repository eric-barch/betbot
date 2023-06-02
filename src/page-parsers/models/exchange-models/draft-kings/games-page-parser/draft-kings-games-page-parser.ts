import * as p from 'puppeteer';

import { prisma } from '@/db';
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
      const statistic = await this.getDbStatistic({ buttonElement });

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

  private async getDbStatistic({
    buttonElement,
  }: {
    buttonElement: p.ElementHandle,
  }): Promise<Statistic> {
    const game = await this.getDbGame({
      buttonElement,
    });

    const statisticName = await this.getStatisticName({
      buttonElement,
      game,
    });

    const dbStatistic = await DbUtilityFunctions.findOrCreateStatisticByGameAndStatisticName({
      game,
      statisticName,
    });

    return dbStatistic;
  }

  private async getStatisticName({
    buttonElement,
    game,
  }: {
    buttonElement: p.ElementHandle,
    game: Game,
  }): Promise<string> {
    const awayTeam = await prisma.team.findFirstOrThrow({
      where: {
        id: game.awayTeamId,
      }
    });

    const homeTeam = await prisma.team.findFirstOrThrow({
      where: {
        id: game.homeTeamId,
      }
    });

    const ariaLabel = await (await buttonElement.getProperty('ariaLabel')).jsonValue();

    if (!ariaLabel) {
      throw new Error(`ariaLabel is null.`);
    }

    const spreadPattern = new RegExp(`^.*\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b[^\\w\\d]*([+-]?\\d+\\.\\d)+?.*`, "i");
    const totalPattern = new RegExp("^.*\\b(O|U|Over|Under)\\b[^\\w\\d]*(\\d+(\\.\\d+)?).*$", "i");
    const winnerPattern = new RegExp(`^.*\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b[^0-9]*$`, "i");

    const spreadPatternMatches = spreadPattern.exec(ariaLabel);
    const totalPatternMatches = totalPattern.exec(ariaLabel);
    const winnerPatternMatches = winnerPattern.exec(ariaLabel);

    if (spreadPatternMatches) {
      const teamIdentifierFull = spreadPatternMatches[1];

      if (teamIdentifierFull == awayTeam.identifierFull) {
        return 'spread_away';
      }

      return 'spread_home';
    } else if (totalPatternMatches) {
      const overUnderIdentifier = totalPatternMatches[1];

      if (overUnderIdentifier.toUpperCase().startsWith('O')) {
        return 'total_over';
      }

      return 'total_under';
    } else if (winnerPatternMatches) {
      const teamIdentifierFull = winnerPatternMatches[1];

      if (teamIdentifierFull == awayTeam.identifierFull) {
        return 'winner_away';
      }

      return 'winner_home';
    }

    throw new Error(`Did not find matching statistic name.`);
  }

  private async getDbGame({
    buttonElement,
  }: {
    buttonElement: p.ElementHandle;
  }): Promise<Game> {
    const exchange = this.exchange;
    const exchangeAssignedGameId = await this.getExchangeAssignedId({ buttonElement });

    const game = await DbUtilityFunctions.findGameByExchangeAssignedGameId({
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