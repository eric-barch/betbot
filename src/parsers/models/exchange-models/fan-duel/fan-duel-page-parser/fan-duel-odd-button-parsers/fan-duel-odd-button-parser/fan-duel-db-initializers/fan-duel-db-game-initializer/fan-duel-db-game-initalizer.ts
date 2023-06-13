import { Game } from '@prisma/client';

import { DbGameInitializer, OddButtonParser } from '@/parsers/models/shared-models';

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
      // this.game = await this.findGameWithExchangeAssignedId();
    } catch {
      //this.game = await this.findOrCreateGameWithoutExchangeAssignedId();
    }

    return this.game;
  }

  private async parseExchangeAssignedGameId(): Promise<string> {
    throw new Error(`parseExchangeAssignedGameId not implemented.`);
  }
}