import { Game } from '@prisma/client';

import { PageParser, SpecializedJsonGamesParser } from '@/parsers/models/common-models';
import { DbUtilityFunctions, prisma } from '@/db';

export class FanDuelJsonGamesParser implements SpecializedJsonGamesParser {
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
  }): Promise<FanDuelJsonGamesParser> {
    const jsonGamesParser = new FanDuelJsonGamesParser({ parentPageParser });
    await jsonGamesParser.init();
    return jsonGamesParser;
  }

  private async init(): Promise<FanDuelJsonGamesParser> {
    this.jsonGames = await this.scrapeJsonGames();
    this.games = await this.parseGames();
    return this;
  }

  private async scrapeJsonGames(): Promise<Array<any>> {
    const jsonGames = await this.parentPageParser.page.$(
      `script[type="application/ld+json"][data-react-helmet="true"]`
    );

    if (!jsonGames) {
      throw new Error('jsonGames is undefined.');
    }

    const textContent = await jsonGames.evaluate(el => el.textContent);

    if (!textContent) {
      throw new Error('textContent is undefined.');
    }

    this.jsonGames = JSON.parse(textContent);
    return this.jsonGames;
  }

  private async parseGames(): Promise<Array<Game>> {
    this.games = new Array<Game>();

    // Run in series (development)
    // for (const jsonGame of this.jsonGames) {
    //   const game = await this.parseGame({ jsonGame });
    //   this.games.push(game);
    // }

    // Run in parallel (production)
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
        }
      },
      update: {
        exchangeAssignedGameId,
      },
      create: {
        exchangeId,
        gameId,
        exchangeAssignedGameId,
      }
    });

    return game;
  }

  private getExchangeAssignedGameId({
    jsonGame,
  }: {
    jsonGame: any,
  }): string {
    const url = jsonGame.url;
    const lastHyphenPos = url.lastIndexOf('-');
    const exchangeAssignedGameId = url.substring(lastHyphenPos + 1);
    return exchangeAssignedGameId;
  }

  public get games(): Array<Game> {
    if (!this.wrappedGames) {
      throw new Error('wrappedGames is undefined.');
    }

    return this.wrappedGames;
  }

  private set jsonGames(jsonGames: Array<any>) {
    this.wrappedJsonGames = jsonGames;
  }

  private get jsonGames(): Array<any> {
    if (!this.wrappedJsonGames) {
      throw new Error('wrappedJsonGames is undefined.');
    }

    return this.wrappedJsonGames;
  }

  private set games(games: Array<Game>) {
    this.wrappedGames = games;
  }
}