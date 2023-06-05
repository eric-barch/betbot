import * as p from 'puppeteer';

import { DbUtilityFunctions } from '@/db';
import { Exchange, Game } from '@prisma/client';
import { OddHandle } from '../../odd-handle';
import { GameWithoutExchangeAssignedIdParser } from './game-without-exchange-assigned-id-parser';

export class GameParser {
  private parentOddHandle: OddHandle;
  private wrappedExchangeAssignedGameId: string | undefined;
  private gameWithoutExchangeAssignedIdParser: GameWithoutExchangeAssignedIdParser | undefined;
  private wrappedGame: Game | undefined;

  constructor({
    parentOddHandle,
  }: {
    parentOddHandle: OddHandle,
  }) {
    this.parentOddHandle = parentOddHandle;
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
    this.gameWithoutExchangeAssignedIdParser = new GameWithoutExchangeAssignedIdParser({ parentOddHandle: this.parentOddHandle });
    this.game = await this.gameWithoutExchangeAssignedIdParser.parse();
    return this.game;
  }

  private get buttonElement(): p.ElementHandle {
    return this.parentOddHandle.buttonElement;
  }

  private get exchange(): Exchange {
    return this.parentOddHandle.exchange;
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
}