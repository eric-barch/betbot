import { GameService, GameWithTeams, TeamService, prisma } from '@/db';
import { DbGameConnection } from '@/parsers/models/common-models';

export class DraftKingsJsonGameParser {
  private readonly parentDbGameConnection: DbGameConnection;
  private readonly exchangeAssignedGameId: string;
  private wrappedJsonGame: any | undefined;
  private wrappedGame: GameWithTeams | undefined;

  private constructor({
    parentDbGameConnection,
    exchangeAssignedGameId,
  }: {
    parentDbGameConnection: DbGameConnection,
    exchangeAssignedGameId: string,
  }) {
    this.parentDbGameConnection = parentDbGameConnection;
    this.exchangeAssignedGameId = exchangeAssignedGameId;
  }

  public static async create({
    parentDbGameConnection,
    exchangeAssignedGameId,
  }: {
    parentDbGameConnection: DbGameConnection,
    exchangeAssignedGameId: string,
  }): Promise<DraftKingsJsonGameParser> {
    const jsonGamesParser = new DraftKingsJsonGameParser({
      parentDbGameConnection,
      exchangeAssignedGameId,
    });
    await jsonGamesParser.init();
    return jsonGamesParser;
  }

  private async init(): Promise<DraftKingsJsonGameParser> {
    this.jsonGame = await this.getJsonGame();
    this.game = await this.parseGame();
    return this;
  }

  private async getJsonGame(): Promise<any> {
    const gameScriptElements = await this.parentDbGameConnection.page.$$(
      'script[type="application/ld+json"]'
    );

    for (const gameScriptElement of gameScriptElements) {
      const jsonGame = await gameScriptElement.evaluate((el) => {
        const jsonGame = JSON.parse(el.innerHTML);
        return jsonGame;
      });

      const exchangeAssignedGameId = this.getExchangeAssignedGameId({ jsonGame });

      if (exchangeAssignedGameId === this.exchangeAssignedGameId) {
        this.jsonGame = jsonGame;
        return this.jsonGame;
      }
    }

    throw new Error(`Unable to find jsonGame with exchangeAssignedGameId: ${this.exchangeAssignedGameId}.`);
  }

  private async parseGame(): Promise<GameWithTeams> {
    const awayTeam = await TeamService.findByUnformattedNameAndLeague({
      unformattedName: this.jsonGame.awayTeam.name,
      league: this.parentDbGameConnection.league,
    });

    const homeTeam = await TeamService.findByUnformattedNameAndLeague({
      unformattedName: this.jsonGame.homeTeam.name,
      league: this.parentDbGameConnection.league,
    });

    const startDate = new Date(this.jsonGame.startDate);

    const game = await GameService.findOrCreateByMatchupAndStartDate({
      awayTeam,
      homeTeam,
      startDate,
    });

    const exchangeId = this.parentDbGameConnection.exchange.id;
    const gameId = game.id;

    await prisma.exchangeToGame.upsert({
      where: {
        exchangeId_gameId: {
          exchangeId,
          gameId,
        },
      },
      update: {
        exchangeAssignedGameId: this.exchangeAssignedGameId,
      },
      create: {
        exchangeId,
        gameId,
        exchangeAssignedGameId: this.exchangeAssignedGameId,
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

  private set jsonGame(jsonGame: any) {
    this.wrappedJsonGame = jsonGame;
  }

  private get jsonGame(): any {
    if (this.wrappedJsonGame === undefined) {
      throw new Error(`wrappedJsonGame is undefined.`);
    }

    return this.wrappedJsonGame;
  }

  private set game(game: GameWithTeams) {
    this.wrappedGame = game;
  }

  private get game(): GameWithTeams {
    if (this.wrappedGame === undefined) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }
}