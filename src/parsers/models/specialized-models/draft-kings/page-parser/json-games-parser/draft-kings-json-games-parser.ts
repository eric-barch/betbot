import { Game } from '@prisma/client';

import { DbUtilityFunctions, prisma } from '@/db';
import { PageParser, SpecializedJsonGamesParser } from '@/parsers/models/common-models';

export class DraftKingsJsonGamesParser implements SpecializedJsonGamesParser {
  private readonly parentPageParser: PageParser;
  private wrappedJsonGames: Array<any> | undefined;
  private wrappedGames: Array<Game> | undefined;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<DraftKingsJsonGamesParser> {
    const jsonGamesParser = new DraftKingsJsonGamesParser({ parentPageParser });
    await jsonGamesParser.init();
    return jsonGamesParser;
  }

  private async init(): Promise<DraftKingsJsonGamesParser> {
    this.jsonGames = await this.scrapeJsonGames();
    this.games = await this.parseGames();
    return this;
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

  private async parseGames(): Promise<Array<Game>> {
    this.games = await Promise.all(
      this.jsonGames.map(async (jsonGame) => {
        return await this.parseGame({ jsonGame });
      })
    );

    return this.games;
  }

  private async parseGame({
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

  public get games(): Array<Game> {
    if (!this.wrappedGames) {
      throw new Error('games is undefined.');
    }

    return this.wrappedGames;
  }

  private set jsonGames(jsonGames: Array<any>) {
    this.wrappedJsonGames = jsonGames;
  }

  private get jsonGames(): Array<any> {
    if (!this.wrappedJsonGames) {
      throw new Error('jsonGames is undefined.');
    }

    return this.wrappedJsonGames;
  }

  private set games(games: Array<Game>) {
    this.wrappedGames = games;
  }
}