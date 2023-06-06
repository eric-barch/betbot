import { DbUtilityFunctions } from '@/db';
import { PageParser } from '@/parsers';
import { Game } from '@prisma/client';

export class JsonGamesParser {
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
  }): Promise<JsonGamesParser> {
    const jsonGamesParser = new JsonGamesParser({ parentPageParser });
    await jsonGamesParser.ensureGamesInDb();
    return jsonGamesParser;
  }

  public async update(): Promise<JsonGamesParser> {
    await this.ensureGamesInDb();
    return this;
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

    for (const gameScriptElement of gameScriptElements) {
      const textContent = await (await gameScriptElement.getProperty('textContent')).jsonValue();

      if (!textContent) {
        continue;
      }

      const gameInJsonFormat = JSON.parse(textContent);

      this.jsonGames.push(gameInJsonFormat);
    }

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
    const awayTeam = await DbUtilityFunctions.findTeamByLeagueAndUnformattedName({
      unformattedName: jsonGame.awayTeam.name,
      league: this.parentPageParser.league,
    });

    const homeTeam = await DbUtilityFunctions.findTeamByLeagueAndUnformattedName({
      unformattedName: jsonGame.homeTeam.name,
      league: this.parentPageParser.league,
    });

    const startDate = new Date(jsonGame.startDate);

    const game = await DbUtilityFunctions.findOrCreateGameByMatchupAndStartDate({
      awayTeam,
      homeTeam,
      startDate,
    });

    const exchange = this.parentPageParser.exchange;
    const exchangeAssignedGameId = this.getExchangeAssignedGameId({ jsonGame });

    await DbUtilityFunctions.associateExchangeAndGameByExchangeAssignedGameId({
      exchange,
      game,
      exchangeAssignedGameId,
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