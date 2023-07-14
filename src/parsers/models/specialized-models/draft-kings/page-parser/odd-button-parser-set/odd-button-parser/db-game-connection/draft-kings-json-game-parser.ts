import { GameService, GameWithTeams, TeamService, prisma } from '@/db';
import { DraftKingsDbGameConnection } from '@/parsers/models/specialized-models/draft-kings';
import { loopInParallel } from '@/setup';

export class DraftKingsJsonGameParser {
  private readonly parent: DraftKingsDbGameConnection;
  private readonly exchangeAssignedGameId: string;
  private wrappedJsonGame: any | undefined;
  private wrappedGame: GameWithTeams | undefined;

  private constructor({
    parent,
    exchangeAssignedGameId,
  }: {
    parent: DraftKingsDbGameConnection,
    exchangeAssignedGameId: string,
  }) {
    this.parent = parent;
    this.exchangeAssignedGameId = exchangeAssignedGameId;
  }

  public static async create({
    parent,
    exchangeAssignedGameId,
  }: {
    parent: DraftKingsDbGameConnection,
    exchangeAssignedGameId: string,
  }): Promise<DraftKingsJsonGameParser> {
    const jsonGamesParser = new DraftKingsJsonGameParser({
      parent,
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
    const gameScriptElements = await this.parent.parent.parent.page.$$(
      'script[type="application/ld+json"]'
    );

    if (loopInParallel) {
      this.jsonGame = await Promise.any(gameScriptElements.map(async gameScriptElement => {
        const jsonGame = await gameScriptElement.evaluate(el => JSON.parse(el.innerHTML));
        const exchangeAssignedGameId = this.getExchangeAssignedGameId({ jsonGame });

        if (exchangeAssignedGameId === this.exchangeAssignedGameId) {
          return jsonGame;
        } else {
          throw new Error('exchangeAssignedGameId does not match.');
        }
      }));
      return this.jsonGame;
    }

    if (!loopInParallel) {
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
    }

    throw new Error(`Unable to find jsonGame with exchangeAssignedGameId: ${this.exchangeAssignedGameId}.`);
  }

  private getExchangeAssignedGameId({
    jsonGame,
  }: {
    jsonGame: any,
  }): string {
    const identifier: string = jsonGame.identifier;
    const lastHyphenPos = identifier.lastIndexOf("-");
    const exchangeAssignedGameId = identifier.substring(lastHyphenPos + 1);
    return exchangeAssignedGameId;
  }

  private async parseGame(): Promise<GameWithTeams> {
    const exchange = this.parent.parent.parent.exchange;
    const league = this.parent.parent.parent.league;

    const awayTeam = await TeamService.findByUnformattedNameAndLeague({
      unformattedName: this.jsonGame.awayTeam.name,
      league,
    });

    const homeTeam = await TeamService.findByUnformattedNameAndLeague({
      unformattedName: this.jsonGame.homeTeam.name,
      league,
    });

    const startDate = new Date(this.jsonGame.startDate);

    this.game = await GameService.findOrCreateByMatchupAndStartDate({
      awayTeam,
      homeTeam,
      startDate,
      createdBy: 'DraftKingsJsonGameParser',
    });

    const exchangeId = exchange.id;
    const gameId = this.game.id;

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

    return this.game;
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

  public get game(): GameWithTeams {
    if (this.wrappedGame === undefined) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }
}