import { Game } from '@prisma/client';

import { OddButtonParser } from '@/parsers/models/shared-models';
import { DbGameInitializer } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/db-initializers/db-game-initializer';
import { prisma } from '@/db';

export class FanDuelDbGameInitializer extends DbGameInitializer {
  private wrappedExchangeAssignedGameId: string | undefined;
  // private wrappedGameParser: FanDuelGameParser | undefined;

  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser;
  }): Promise<FanDuelDbGameInitializer> {
    const fanDuelDbGameInitializer = new FanDuelDbGameInitializer({ parentOddButtonParser });
    await fanDuelDbGameInitializer.init();
    return fanDuelDbGameInitializer;
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

    const linkElement = await button.$('xpath/../../../a');

    if (!linkElement) {
      throw new Error(`linkElement is null.`);
    }

    const href = await linkElement.evaluate(el => el.getAttribute('href'));

    if (!href) {
      throw new Error(`href is null.`);
    }

    const lastHyphenPos = href.lastIndexOf('-');

    this.exchangeAssignedGameId = href.substring(lastHyphenPos + 1);
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
    throw new Error(`findOrCreateGameWithoutExchangeAssignedId not implemented.`);
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
}