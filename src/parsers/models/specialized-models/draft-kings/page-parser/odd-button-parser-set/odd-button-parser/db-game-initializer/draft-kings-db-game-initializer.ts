import { GameWithTeams, prisma } from '@/db';
import { DbGameInitializer, OddButtonParser, SpecializedDbGameInitializer } from '@/parsers/models/common-models';

import { DraftKingsGameParser } from './draft-kings-game-parser';

export class DraftKingsDbGameInitializer implements SpecializedDbGameInitializer {
  private readonly parentDbGameInitializer: DbGameInitializer;
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedGameParser: DraftKingsGameParser | undefined;

  public constructor({
    parentDbGameInitializer,
  }: {
    parentDbGameInitializer: DbGameInitializer,
  }) {
    this.parentDbGameInitializer = parentDbGameInitializer;
  }

  public async findOrCreateGame(): Promise<GameWithTeams> {
    await this.parseExchangeAssignedGameId();

    try {
      return await this.findGameWithExchangeAssignedId();
    } catch {
      return await this.findOrCreateGameWithoutExchangeAssignedId();
    }
  }

  private async parseExchangeAssignedGameId(): Promise<string> {
    const button = this.parentDbGameInitializer.button;

    if (!button) {
      throw new Error(`button is null.`);
    }

    const dataTrackingObject = await button.evaluate((el) => (el.getAttribute('data-tracking')));

    if (!dataTrackingObject) {
      throw new Error(`dataTrackingObject is null.`);
    }

    const parsedDataTrackingObject = JSON.parse(dataTrackingObject);

    this.exchangeAssignedGameId = parsedDataTrackingObject.eventId;
    return this.exchangeAssignedGameId;
  }

  private async findGameWithExchangeAssignedId(): Promise<GameWithTeams> {
    const exchangeToGame = await prisma.exchangeToGame.findUniqueOrThrow({
      where: {
        exchangeId_exchangeAssignedGameId: {
          exchangeId: this.parentDbGameInitializer.exchange.id,
          exchangeAssignedGameId: this.exchangeAssignedGameId,
        },
      },
      include: {
        game: {
          include: {
            awayTeam: true,
            homeTeam: true,
          }
        }
      }
    });

    return exchangeToGame.game;
  }

  private async findOrCreateGameWithoutExchangeAssignedId(): Promise<GameWithTeams> {
    this.gameParser = await DraftKingsGameParser.create({
      parentDbGameInitializer: this.parentDbGameInitializer,
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