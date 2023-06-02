import { DbUtilityFunctions } from '@/db';
import { PageParser } from '@/page-parsers';
import { Game } from '@prisma/client';

export class JsonGamesParser {
  private pageParser: PageParser;
  private jsonGames: Array<any>;
  private dbGames: Array<Game>;

  constructor({
    pageParser,
  }: {
    pageParser: PageParser,
  }) {
    this.pageParser = pageParser;
    this.jsonGames = new Array<any>;
    this.dbGames = new Array<Game>;
  }

  public async ensureGamesInDb(): Promise<Array<Game>> {
    await this.scrapeJsonGames();
    await this.parseDbGames();
    return this.dbGames;
  }

  private async scrapeJsonGames(): Promise<Array<any>> {
    const gameScriptElements = await this.pageParser.page.$$(
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
      league: this.pageParser.league,
    });

    const homeTeam = await DbUtilityFunctions.findTeamByLeagueAndUnformattedName({
      unformattedName: jsonGame.homeTeam.name,
      league: this.pageParser.league,
    });

    const startDate = new Date(jsonGame.startDate);

    const game = await DbUtilityFunctions.findOrCreateGameByMatchupAndStartDate({
      awayTeam,
      homeTeam,
      startDate,
    });

    const exchange = this.pageParser.exchange;
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