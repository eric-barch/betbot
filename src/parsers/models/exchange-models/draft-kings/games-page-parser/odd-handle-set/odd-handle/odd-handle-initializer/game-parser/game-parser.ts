import * as p from 'puppeteer';

import { Exchange, Game } from '@prisma/client';
import { DbUtilityFunctions } from '@/db';
import { OddHandleInitializer } from '../odd-handle-initializer';
import { GameWithoutExchangeAssignedIdParser } from './game-without-exchange-assigned-id-parser';

export class GameParser {
  private parent: OddHandleInitializer;
  private wrappedExchangeAssignedGameId: string | undefined;
  private newGameParser: GameWithoutExchangeAssignedIdParser | undefined;
  private wrappedGame: Game | undefined;

  constructor({
    parent,
  }: {
    parent: OddHandleInitializer,
  }) {
    this.parent = parent;
  }

  public async parse(): Promise<Game> {
    await this.parseExchangeAssignedGameId();

    try {
      await this.findGameWithExchangeAssignedId();
    } catch {
      await this.findOrCreateGameWithoutExchangeAssignedId();
    }

    return this.game;
  }

  private async parseExchangeAssignedGameId(): Promise<string> {
    const dataTracking = await this.buttonElement.evaluate(el => el.getAttribute('data-tracking') || '');
    const parsedDataTracking = JSON.parse(dataTracking);
    this.exchangeAssignedGameId = parsedDataTracking.eventId;
    return this.exchangeAssignedGameId;
  }

  private async findGameWithExchangeAssignedId(): Promise<Game> {
    const exchange = this.exchange;
    const exchangeAssignedGameId = this.exchangeAssignedGameId;

    this.game = await DbUtilityFunctions.findGameByExchangeAndExchangeAssignedGameId({
      exchange,
      exchangeAssignedGameId,
    });

    return this.game;
  }

  private async findOrCreateGameWithoutExchangeAssignedId(): Promise<Game> {
    this.newGameParser = new GameWithoutExchangeAssignedIdParser({ parent: this });
    await this.newGameParser.parse();
    this.game = this.newGameParser.game;
    return this.game;
  }

  public get buttonElement(): p.ElementHandle {
    return this.parent.buttonElement;
  }

  public get exchange(): Exchange {
    return this.parent.exchange;
  }

  public get exchangeAssignedGameId(): string {
    if (!this.wrappedExchangeAssignedGameId) {
      throw new Error(`wrappedExchangeAssignedGameId is undefined.`);
    }

    return this.wrappedExchangeAssignedGameId;
  }

  private set exchangeAssignedGameId(exchangeAssignedGameId: string) {
    this.wrappedExchangeAssignedGameId = exchangeAssignedGameId;
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