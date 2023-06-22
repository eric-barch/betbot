import { Game } from '@prisma/client';

import { prisma } from '@/db';
import { OddButtonParser } from '@/parsers/models/common-models';
import { DbGameInitializer, SpecializedDbGameInitializer } from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/db-initializers/db-game-initializer';

import { DraftKingsGameParser } from './draft-kings-game-parser';

export class DraftKingsDbGameInitializer implements SpecializedDbGameInitializer {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly parentDbGameInitializer: DbGameInitializer;
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedGameParser: DraftKingsGameParser | undefined;

  public constructor({
    parentOddButtonParser,
    parentDbGameInitializer,
  }: {
    parentOddButtonParser: OddButtonParser;
    parentDbGameInitializer: DbGameInitializer;
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.parentDbGameInitializer = parentDbGameInitializer;
  }

  public async findOrCreateCorrespondingDbGame(): Promise<Game> {
    await this.parseExchangeAssignedGameId();

    try {
      return await this.findGameWithExchangeAssignedId();
    } catch {
      return await this.findOrCreateGameWithoutExchangeAssignedId();
    }
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

    return exchangeToGame.game;
  }

  private async findOrCreateGameWithoutExchangeAssignedId(): Promise<Game> {
    this.gameParser = await DraftKingsGameParser.create({
      parentOddButtonParser: this.parentOddButtonParser,
      exchangeAssignedGameId: this.exchangeAssignedGameId,
    });
    return this.gameParser.game;
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