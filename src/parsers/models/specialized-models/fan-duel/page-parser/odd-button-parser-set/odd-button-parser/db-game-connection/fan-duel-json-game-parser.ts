import { GameService, GameWithTeams, TeamService, prisma } from '@/db';
import { DbGameConnection } from '@/parsers/models/common-models';
import { loopInParallel } from '@/setup';

export class FanDuelJsonGameParser {
  private readonly parent: DbGameConnection;
  private readonly exchangeAssignedGameId: string;
  private wrappedJsonGame: any | undefined;
  private wrappedGame: GameWithTeams | undefined;

  private constructor({
    parent,
    exchangeAssignedGameId,
  }: {
    parent: DbGameConnection,
    exchangeAssignedGameId: string,
  }) {
    this.parent = parent;
    this.exchangeAssignedGameId = exchangeAssignedGameId;
  }

  public static async create({
    parent,
    exchangeAssignedGameId,
  }: {
    parent: DbGameConnection,
    exchangeAssignedGameId: string,
  }): Promise<FanDuelJsonGameParser> {
    const jsonGamesParser = new FanDuelJsonGameParser({
      parent,
      exchangeAssignedGameId,
    });
    await jsonGamesParser.init();
    return jsonGamesParser;
  }

  private async init(): Promise<FanDuelJsonGameParser> {
    this.jsonGame = await this.getJsonGame();
    this.game = await this.parseGame();
    return this;
  }

  private async getJsonGame(): Promise<any> {
    const gamesScriptElement = (await this.parent.parent.parent.page.$(
      'script[type="application/ld+json"][data-react-helmet="true"]'
    ))!;
    const jsonGames: Array<any> = await gamesScriptElement.evaluate(el => {
      return JSON.parse(el.innerHTML);
    });

    if (loopInParallel) {
      this.jsonGame = await Promise.any(jsonGames.map(async (jsonGame: any) => {
        const exchangeAssignedGameId = this.getExchangeAssignedGameId({ jsonGame });

        if (exchangeAssignedGameId === this.exchangeAssignedGameId) {
          return jsonGame;
        } else {
          throw new Error('exchangeAssignedGameId does not match.');
        }
      }))
    }

    if (!loopInParallel) {
      for (const jsonGame of jsonGames) {
        const exchangeAssignedGameId = this.getExchangeAssignedGameId({ jsonGame });

        if (exchangeAssignedGameId === this.exchangeAssignedGameId) {
          this.jsonGame = jsonGame;
          break;
        }
      }
    }

    return this.jsonGame;
  }

  private getExchangeAssignedGameId({
    jsonGame,
  }: {
    jsonGame: any,
  }): string {
    const url: string = jsonGame.url;
    const lastHyphenPos = url.lastIndexOf('-');
    const exchangeAssignedGameId = url.substring(lastHyphenPos + 1);
    return exchangeAssignedGameId;
  }

  private async parseGame(): Promise<GameWithTeams> {
    const awayTeam = await TeamService.findByUnformattedNameAndLeague({
      unformattedName: this.jsonGame.awayTeam.name,
      league: this.parent.parent.parent.league,
    });

    const homeTeam = await TeamService.findByUnformattedNameAndLeague({
      unformattedName: this.jsonGame.homeTeam.name,
      league: this.parent.parent.parent.league,
    });

    const startDate = new Date(this.jsonGame.startDate);

    this.game = await GameService.findOrCreateByMatchupAndStartDate({
      awayTeam,
      homeTeam,
      startDate,
      createdBy: 'FanDuelJsonGameParser',
    });

    const exchangeId = this.parent.parent.parent.exchange.id;
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