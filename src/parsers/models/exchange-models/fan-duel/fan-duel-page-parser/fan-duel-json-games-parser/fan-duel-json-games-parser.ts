import { Game } from '@prisma/client';

import { DbUtilityFunctions, prisma } from '@/db';
import { PageParser } from '@/parsers/models/shared-models';

export class FanDuelJsonGamesParser {
  private parentPageParser: PageParser;
  private jsonGames: Array<any>;
  private dbGames: Array<Game>;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
    this.jsonGames = new Array<any>;
    this.dbGames = new Array<Game>;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<FanDuelJsonGamesParser> {
    const jsonGamesParser = new FanDuelJsonGamesParser({ parentPageParser });
    await jsonGamesParser.ensureGamesInDb();
    return jsonGamesParser;
  }

  public async ensureGamesInDb(): Promise<Array<Game>> {
    await this.scrapeJsonGames();
    await this.parseDbGames();
    return this.dbGames;
  }

  private async scrapeJsonGames(): Promise<Array<any>> {
    const jsonGamesElement = await this.parentPageParser.page.$(
      'script[type="application/ld+json"][data-react-helmet="true"]'
    );

    if (!jsonGamesElement) {
      throw new Error(`jsonGamesElement is null.`);
    }

    const textContent = await (await jsonGamesElement.getProperty('textContent')).jsonValue();

    if (!textContent) {
      throw new Error(`textContent is null.`);
    }

    this.jsonGames = JSON.parse(textContent);

    return this.jsonGames;
  }

  private async parseDbGames(): Promise<Array<Game>> {
    for (const jsonGame of this.jsonGames) {
      const game = await this.parseDbGame({ jsonGame });
      this.dbGames.push(game);
    }

    return this.dbGames;
  }

  private async parseDbGame({
    jsonGame,
  }: {
    jsonGame: any,
  }): Promise<Game> {
    const awayTeam = await DbUtilityFunctions.findTeamByUnformattedNameAndLeague({
      unformattedName: jsonGame.awayTeam.name,
      league: this.parentPageParser.league,
    });

    const homeTeam = await DbUtilityFunctions.findTeamByUnformattedNameAndLeague({
      unformattedName: jsonGame.homeTeam.name,
      league: this.parentPageParser.league,
    });

    const startDate = new Date(jsonGame.startDate);

    const game = await DbUtilityFunctions.findOrCreateGameByMatchupAndStartDate({
      awayTeam,
      homeTeam,
      startDate,
    });

    const exchangeId = this.parentPageParser.exchange.id;
    const gameId = game.id;
    const exchangeAssignedGameId = this.getExchangeAssignedGameId({ jsonGame });

    await prisma.exchangeToGame.upsert({
      where: {
        exchangeId_gameId: {
          exchangeId,
          gameId,
        },
      },
      update: {
        exchangeAssignedGameId,
      },
      create: {
        exchangeId,
        gameId,
        exchangeAssignedGameId,
      },
    });

    return game;
  }

  private getExchangeAssignedGameId({
    jsonGame,
  }: {
    jsonGame: any,
  }): string {
    const url = jsonGame.url;
    const lastHyphenPos = url.lastIndexOf("-");
    const exchangeAssignedGameId = url.substring(lastHyphenPos + 1);
    return exchangeAssignedGameId;
  }
}