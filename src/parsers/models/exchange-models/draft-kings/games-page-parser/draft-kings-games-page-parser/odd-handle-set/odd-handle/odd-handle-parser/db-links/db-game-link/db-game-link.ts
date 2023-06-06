
import { DbUtilityFunctions } from '@/db';
import { Game } from '@prisma/client';
import { OddHandleParser } from '../../odd-handle-parser';
import { GameParser } from './game-parser';

export class DbGameLink {
  private parentOddHandleParser: OddHandleParser;
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedGameParser: GameParser | undefined;
  private wrappedGame: Game | undefined;

  private constructor({
    parentOddHandleParser,
  }: {
    parentOddHandleParser: OddHandleParser,
  }) {
    this.parentOddHandleParser = parentOddHandleParser;
  }

  public static async create({
    parentOddHandleParser,
  }: {
    parentOddHandleParser: OddHandleParser,
  }): Promise<DbGameLink> {
    const dbGameLink = new DbGameLink({ parentOddHandleParser });
    await dbGameLink.link();
    return dbGameLink;
  }

  private async link(): Promise<Game> {
    await this.parseExchangeAssignedGameId();

    try {
      await this.findGameWithExchangeAssignedId();
    } catch {
      await this.findOrCreateGameWithoutExchangeAssignedId();
    }

    return this.game;
  }

  private async parseExchangeAssignedGameId(): Promise<string> {
    const buttonElement = this.parentOddHandleParser.buttonElement;

    if (!buttonElement) {
      throw new Error(`buttonElement is null.`);
    }

    const dataTracking = await buttonElement.evaluate(el => JSON.parse(el.getAttribute('data-tracking') || ''));
    this.exchangeAssignedGameId = dataTracking.eventId;
    return this.exchangeAssignedGameId;
  }

  private async findGameWithExchangeAssignedId(): Promise<Game> {
    const exchange = this.parentOddHandleParser.exchange;
    const exchangeAssignedGameId = this.exchangeAssignedGameId;

    this.game = await DbUtilityFunctions.findGameByExchangeAndExchangeAssignedGameId({
      exchange,
      exchangeAssignedGameId,
    });

    return this.game;
  }

  private async findOrCreateGameWithoutExchangeAssignedId(): Promise<Game> {
    this.gameParser = await GameParser.create({
      parentOddHandleParser: this.parentOddHandleParser,
      exchangeAssignedGameId: this.exchangeAssignedGameId,
    });
    this.game = this.gameParser.game;
    return this.game;
  }

  private set exchangeAssignedGameId(exchangeAssignedGameId: string) {
    this.wrappedExchangeAssignedGameId = exchangeAssignedGameId;
  }

  public get exchangeAssignedGameId(): string {
    if (!this.wrappedExchangeAssignedGameId) {
      throw new Error(`wrappedExchangeAssignedGameId is undefined.`);
    }

    return this.wrappedExchangeAssignedGameId;
  }

  private set game(game: Game) {
    this.wrappedGame = game;
  }

  public get game(): Game {
    if (!this.wrappedGame) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }

  private set gameParser(gameDetailsParser: GameParser) {
    this.wrappedGameParser = gameDetailsParser;
  }

  private get gameParser(): GameParser {
    if (!this.wrappedGameParser) {
      throw new Error(`wrappedGameDetails is undefined.`);
    }

    return this.wrappedGameParser;
  }
}