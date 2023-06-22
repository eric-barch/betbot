
import { Game } from '@prisma/client';

import { DbUtilityFunctions, prisma } from '@/db';
import {
  DraftKingsMatchupParser, DraftKingsStartDateParser
} from '@/parsers/models/exchange-models/draft-kings';
import { CommonOddButtonParser } from '@/parsers/models/common-models';

export class DraftKingsGameParser {
  private parentOddButtonParser: CommonOddButtonParser;
  private exchangeAssignedGameId: string;
  private startDateParser: DraftKingsStartDateParser;
  private matchupParser: DraftKingsMatchupParser;
  private wrappedGame: Game | undefined;

  private constructor({
    parentOddButtonParser,
    exchangeAssignedGameId,
  }: {
    parentOddButtonParser: CommonOddButtonParser,
    exchangeAssignedGameId: string,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.exchangeAssignedGameId = exchangeAssignedGameId;
    this.startDateParser = new DraftKingsStartDateParser({ parentOddButtonParser: this.parentOddButtonParser });
    this.matchupParser = new DraftKingsMatchupParser({ parentOddButtonParser: this.parentOddButtonParser });
  }

  public static async create({
    parentOddButtonParser,
    exchangeAssignedGameId,
  }: {
    parentOddButtonParser: CommonOddButtonParser,
    exchangeAssignedGameId: string,
  }): Promise<DraftKingsGameParser> {
    const gameDetailsParser = new DraftKingsGameParser({
      parentOddButtonParser,
      exchangeAssignedGameId,
    });
    await gameDetailsParser.parse();
    return gameDetailsParser;
  }

  private async parse(): Promise<Game> {
    await this.startDateParser.parse();
    await this.matchupParser.parse();

    this.game = await DbUtilityFunctions.findOrCreateGameByMatchupAndStartDate({
      awayTeam: this.matchupParser.awayTeam,
      homeTeam: this.matchupParser.homeTeam,
      startDate: this.startDateParser.startDate,
    });

    const exchangeId = this.parentOddButtonParser.exchange.id;
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

  public get game(): Game {
    if (!this.wrappedGame) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }

  private set game(game: Game) {
    this.wrappedGame = game;
  }
}