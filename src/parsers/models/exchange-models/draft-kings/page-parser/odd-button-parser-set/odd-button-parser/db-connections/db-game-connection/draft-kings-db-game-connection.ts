import { DbUtilityFunctions, prisma } from '@/db';
import { OddButtonParser } from '@/parsers';
import { DbGameConnection as DbGame } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/db-connections/db-game-connection';
import { Game } from '@prisma/client';
import { DraftKingsGameParser } from './draft-kings-game-parser';

export class DraftKingsDbGame extends DbGame {
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedGameParser: DraftKingsGameParser | undefined;

  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<DraftKingsDbGame> {
    const draftKingsDbGameConnection = new DraftKingsDbGame({ parentOddButtonParser });
    await draftKingsDbGameConnection.init();
    return draftKingsDbGameConnection;
  }

  protected async updateDbGame(): Promise<Game> {
    await this.parseExchangeAssignedGameId();

    try {
      this.game = await this.findGameWithExchangeAssignedId();
    } catch {
      this.game = await this.findOrCreateGameWithoutExchangeAssignedId();
    }

    return this.game;
  }

  private async parseExchangeAssignedGameId(): Promise<string> {
    const buttonElement = this.parentOddButtonParser.button;

    if (!buttonElement) {
      throw new Error(`buttonElement is null.`);
    }

    const dataTracking = await buttonElement.evaluate(el => JSON.parse(el.getAttribute('data-tracking') || ''));
    this.exchangeAssignedGameId = dataTracking.eventId;
    return this.exchangeAssignedGameId;
  }

  private async findGameWithExchangeAssignedId(): Promise<Game> {
    const exchangeToGame = await prisma.exchangeToGame.findUniqueOrThrow({
      where: {
        exchangeId_exchangeAssignedGameId: {
          exchangeId: this.parentOddButtonParser.exchange.id,
          exchangeAssignedGameId: this.exchangeAssignedGameId,
        },
      },
      include: {
        game: true,
      },
    });

    this.game = exchangeToGame.game;
    return this.game;
  }

  private async findOrCreateGameWithoutExchangeAssignedId(): Promise<Game> {
    this.gameParser = await DraftKingsGameParser.create({
      parentOddButtonParser: this.parentOddButtonParser,
      exchangeAssignedGameId: this.exchangeAssignedGameId,
    });
    this.game = this.gameParser.game;
    return this.game;
  }

  private set exchangeAssignedGameId(exchangeAssignedGameId: string) {
    this.wrappedExchangeAssignedGameId = exchangeAssignedGameId;
  }

  private get exchangeAssignedGameId(): string {
    if (!this.wrappedExchangeAssignedGameId) {
      throw new Error(`wrappedExchangeAssignedGameId is undefined.`);
    }

    return this.wrappedExchangeAssignedGameId;
  }

  private set gameParser(gameParser: DraftKingsGameParser) {
    this.wrappedGameParser = gameParser;
  }

  private get gameParser(): DraftKingsGameParser {
    if (!this.wrappedGameParser) {
      throw new Error(`wrappedGameParser is undefined.`);
    }

    return this.wrappedGameParser;
  }
}