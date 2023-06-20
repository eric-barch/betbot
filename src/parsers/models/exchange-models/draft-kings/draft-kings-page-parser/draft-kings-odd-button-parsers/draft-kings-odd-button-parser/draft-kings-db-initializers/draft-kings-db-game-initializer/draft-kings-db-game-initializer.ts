import { Game } from '@prisma/client';

import { prisma } from '@/db';
import { DraftKingsGameParser } from '@/parsers/models/exchange-models/draft-kings';
import { OddButtonParser } from '@/parsers/models/common-models';
import { DbGameInitializer } from '@/parsers/models/common-models/page-parser/odd-button-parsers/odd-button-parser/db-initializers/db-game-initializer';

export class DraftKingsDbGameInitializer extends DbGameInitializer {
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedGameParser: DraftKingsGameParser | undefined;

  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser;
  }): Promise<DraftKingsDbGameInitializer> {
    const draftKingsDbGameInitializer = new DraftKingsDbGameInitializer({ parentOddButtonParser });
    await draftKingsDbGameInitializer.init();
    return draftKingsDbGameInitializer;
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
    const button = this.parentOddButtonParser.button;

    if (!button) {
      throw new Error(`button is null.`);
    }

    const dataTracking = await this.parentOddButtonParser.button.evaluate(
      el => JSON.parse(el.getAttribute('data-tracking') || '')
    );

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