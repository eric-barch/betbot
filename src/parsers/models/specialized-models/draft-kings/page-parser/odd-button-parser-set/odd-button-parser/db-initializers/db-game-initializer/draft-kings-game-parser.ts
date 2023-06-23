import { DbUtilityFunctions, GameWithTeams, prisma } from '@/db';
import { DbGameInitializer } from '@/parsers/models/common-models';

import { DraftKingsMatchupParser } from './draft-kings-matchup-parser';
import { DraftKingsStartDateParser } from './draft-kings-start-date-parser';


export class DraftKingsGameParser {
  private readonly parentDbGameInitializer: DbGameInitializer;
  private exchangeAssignedGameId: string;
  private startDateParser: DraftKingsStartDateParser;
  private matchupParser: DraftKingsMatchupParser;
  private wrappedGame: GameWithTeams | undefined;

  private constructor({
    parentDbGameInitializer,
    exchangeAssignedGameId,
  }: {
    parentDbGameInitializer: DbGameInitializer,
    exchangeAssignedGameId: string,
  }) {
    this.parentDbGameInitializer = parentDbGameInitializer;
    this.exchangeAssignedGameId = exchangeAssignedGameId;
    this.startDateParser = new DraftKingsStartDateParser({ parentDbGameInitializer });
    this.matchupParser = new DraftKingsMatchupParser({ parentDbGameInitializer });
  }

  public static async create({
    parentDbGameInitializer,
    exchangeAssignedGameId,
  }: {
    parentDbGameInitializer: DbGameInitializer,
    exchangeAssignedGameId: string,
  }): Promise<DraftKingsGameParser> {
    const gameDetailsParser = new DraftKingsGameParser({
      parentDbGameInitializer,
      exchangeAssignedGameId,
    });
    await gameDetailsParser.parse();
    return gameDetailsParser;
  }

  private async parse(): Promise<GameWithTeams> {
    await this.startDateParser.parse();
    await this.matchupParser.parse();

    this.game = await DbUtilityFunctions.findOrCreateGameByMatchupAndStartDate({
      awayTeam: this.matchupParser.awayTeam,
      homeTeam: this.matchupParser.homeTeam,
      startDate: this.startDateParser.startDate,
    });

    const exchangeId = this.parentDbGameInitializer.exchange.id;
    const gameId = this.game.id;
    const exchangeAssignedGameId = this.exchangeAssignedGameId;

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

    return this.game;
  }

  public get game(): GameWithTeams {
    if (!this.wrappedGame) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }

  private set game(game: GameWithTeams) {
    this.wrappedGame = game;
  }
}