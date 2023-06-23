import { DbUtilityFunctions, GameWithTeams, prisma } from '@/db';
import { DbGameInitializer } from '@/parsers/models/common-models';

import { DraftKingsMatchupParser } from './draft-kings-matchup-parser';
import { DraftKingsStartDateParser } from './draft-kings-start-date-parser';

export class DraftKingsGameParser {
  private readonly parentDbGameInitializer: DbGameInitializer;
  private exchangeAssignedGameId: string;
  private wrappedStartDateParser: DraftKingsStartDateParser | undefined;
  private wrappedMatchupParser: DraftKingsMatchupParser | undefined;
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
    await gameDetailsParser.init();
    return gameDetailsParser;
  }

  private async init(): Promise<GameWithTeams> {
    this.startDateParser = await DraftKingsStartDateParser.create({ parentDbGameInitializer: this.parentDbGameInitializer });
    this.matchupParser = await DraftKingsMatchupParser.create({ parentDbGameInitializer: this.parentDbGameInitializer });

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

  private set startDateParser(startDateParser: DraftKingsStartDateParser) {
    this.wrappedStartDateParser = startDateParser;
  }

  private get startDateParser(): DraftKingsStartDateParser {
    if (!this.wrappedStartDateParser) {
      throw new Error(`wrappedStartDateParser is undefined.`);
    }

    return this.wrappedStartDateParser;
  }

  private set matchupParser(matchupParser: DraftKingsMatchupParser) {
    this.wrappedMatchupParser = matchupParser;
  }

  private get matchupParser(): DraftKingsMatchupParser {
    if (!this.wrappedMatchupParser) {
      throw new Error(`wrappedMatchupParser is undefined.`);
    }

    return this.wrappedMatchupParser;
  }

  private set game(game: GameWithTeams) {
    this.wrappedGame = game;
  }
}