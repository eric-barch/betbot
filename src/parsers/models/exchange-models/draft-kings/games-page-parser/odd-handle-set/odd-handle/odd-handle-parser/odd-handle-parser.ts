import * as p from 'puppeteer';

import { Exchange, Game, Odd, Statistic } from '@prisma/client';
import { OddHandle } from '../';
import { GameParser, OddParser, StatisticParser } from './';

export class OddHandleParser {
  private parentOddHandle: OddHandle;
  private gameParser: GameParser;
  private statisticParser: StatisticParser;
  private oddParser: OddParser;

  constructor({
    parentOddHandle,
  }: {
    parentOddHandle: OddHandle,
  }) {
    this.parentOddHandle = parentOddHandle;
    this.gameParser = new GameParser({ parentOddHandle: this.parentOddHandle });
    this.statisticParser = new StatisticParser({ parentOddHandle: this.parentOddHandle });
    this.oddParser = new OddParser({ parentOddHandle: this.parentOddHandle });
  }

  public async parseValueElement(): Promise<p.ElementHandle | null> {
    const valueElement = await this.buttonElement.$('.sportsbook-outcome-cell__label-line-container');
    return valueElement;
  }

  public async parsePriceElement(): Promise<p.ElementHandle | null> {
    const priceElement = await this.buttonElement.$('.sportsbook-outcome-cell__elements');
    return priceElement;
  }

  public async parseOdd(): Promise<Odd> {
    await this.gameParser.parse();
    await this.statisticParser.parse();
    await this.oddParser.parse();
    return this.odd;
  }

  public get buttonElement(): p.ElementHandle {
    return this.parentOddHandle.buttonElement;
  }

  public get exchange(): Exchange {
    return this.parentOddHandle.exchange;
  }

  public get exchangeAssignedGameId(): string {
    return this.gameParser.exchangeAssignedGameId;
  }

  public get game(): Game {
    return this.gameParser.game;
  }

  public get statistic(): Statistic {
    return this.statisticParser.statistic;
  }

  public get odd(): Odd {
    return this.oddParser.odd;
  }
}