
import { DbUtilityFunctions } from '@/db';
import { Game } from '@prisma/client';
import { OddHandleParser } from '../odd-handle-parser';
import { GameDetailsParser } from './game-without-exchange-assigned-id-parser';

export class GameLinker {
  private parentOddHandleParser: OddHandleParser;
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedGameDetailsParser: GameDetailsParser | undefined;
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
  }): Promise<GameLinker> {
    const gameLinker = new GameLinker({ parentOddHandleParser });
    await gameLinker.link();
    return gameLinker;
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
    const dataTracking = await buttonElement.evaluate(el => el.getAttribute('data-tracking') || '');
    const parsedDataTracking = JSON.parse(dataTracking);
    this.exchangeAssignedGameId = parsedDataTracking.eventId;
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
    this.gameDetailsParser = await GameDetailsParser.create({
      parentOddHandleParser: this.parentOddHandleParser,
      exchangeAssignedGameId: this.exchangeAssignedGameId,
    });
    this.game = this.gameDetailsParser.game;
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

  private set gameDetailsParser(gameDetailsParser: GameDetailsParser) {
    this.wrappedGameDetailsParser = gameDetailsParser;
  }

  private get gameDetailsParser(): GameDetailsParser {
    if (!this.wrappedGameDetailsParser) {
      throw new Error(`wrappedGameDetails is undefined.`);
    }

    return this.wrappedGameDetailsParser;
  }
}