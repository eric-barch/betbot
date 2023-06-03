import * as p from 'puppeteer';

import { Exchange, Game, Odd, Statistic } from '@prisma/client';
import { OddHandle } from '../odd-handle';
import { GameParser } from './game-parser';
import { StatisticParser } from './statistic-parser';
import { OddParser } from './odd-parser';

export class OddHandleInitializer {
  private parent: OddHandle
  private gameParser: GameParser;
  private statisticParser: StatisticParser;
  private oddParser: OddParser;

  constructor({
    parent,
  }: {
    parent: OddHandle,
  }) {
    this.parent = parent;
    this.gameParser = new GameParser({ parent: this });
    this.statisticParser = new StatisticParser({ parent: this });
    this.oddParser = new OddParser({ parent: this });
  }

  public async initValueElement(): Promise<p.ElementHandle | null> {
    const valueElement = await this.buttonElement.$('.sportsbook-outcome-cell__label-line-container');
    return valueElement;
  }

  public async initPriceElement(): Promise<p.ElementHandle | null> {
    const priceElement = await this.buttonElement.$('.sportsbook-outcome-cell__elements');
    return priceElement;
  }

  public async initOdd(): Promise<Odd> {
    await this.gameParser.parse();
    await this.statisticParser.parse();
    await this.oddParser.parse();
    return this.odd;
  }

  public get exchange(): Exchange {
    return this.parent.exchange;
  }

  public get buttonElement(): p.ElementHandle {
    return this.parent.buttonElement;
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