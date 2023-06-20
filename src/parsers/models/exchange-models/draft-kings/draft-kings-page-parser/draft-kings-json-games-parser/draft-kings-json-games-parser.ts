import { Game } from '@prisma/client';

import { DbUtilityFunctions, prisma } from '@/db';
import { IExchangePageParser } from '@/parsers/models/shared-models';

export class DraftKingsJsonGamesParser {
  private parentPageParser: IExchangePageParser;
  private jsonGames: Array<any>;
  private dbGames: Array<Game>;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: IExchangePageParser,
  }) {
    this.parentPageParser = parentPageParser;
    this.jsonGames = new Array<any>;
    this.dbGames = new Array<Game>;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: IExchangePageParser,
  }): Promise<DraftKingsJsonGamesParser> {
    const jsonGamesParser = new DraftKingsJsonGamesParser({ parentPageParser });
    await jsonGamesParser.ensureGamesInDb();
    return jsonGamesParser;
  }

  public async ensureGamesInDb(): Promise<Array<Game>> {
    await this.scrapeJsonGames();
    await this.parseDbGames();
    return this.dbGames;
  }

  private async scrapeJsonGames(): Promise<Array<any>> {
    const gameScriptElements = await this.parentPageParser.page.$$(
      'script[type="application/ld+json"]'
    );

    const jsonGames = await Promise.all(
      gameScriptElements.map(async (gameScriptElement) => {
        const textContent = await (await gameScriptElement.getProperty('textContent')).jsonValue();

        if (!textContent) {
          return;
        }

        const jsonGame = JSON.parse(textContent);
        return jsonGame;
      })
    );

    this.jsonGames = jsonGames.filter(Boolean);
    return this.jsonGames;
  }

  private async parseDbGames(): Promise<Array<Game>> {
    this.dbGames = await Promise.all(
      this.jsonGames.map(async (jsonGame) => {
        return await this.parseDbGame({ jsonGame });
      })
    );

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
    const identifier = jsonGame.identifier;
    const lastHyphenPos: number = identifier.lastIndexOf("-");
    const exchangeAssignedGameId = identifier.substring(lastHyphenPos + 1);
    return exchangeAssignedGameId;
  }
}