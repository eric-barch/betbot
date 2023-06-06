import * as p from 'puppeteer';

import { PageParser } from '@/parsers';
import { Exchange, Game, League, Odd, Statistic } from '@prisma/client';
import { OddDataElementParser } from './element-parser';
import { GameLinker } from './game-parser';
import { OddLinker } from './odd-parser';
import { StatisticLinker } from './statistic-parser';

export class OddHandleParser {
  private parentPageParser: PageParser;
  private wrappedButtonElement: p.ElementHandle;
  private gameLinker: GameLinker | undefined;
  private statisticLinker: StatisticLinker | undefined;
  private wrappedOddLinker: OddLinker | undefined;
  private priceParser: OddDataElementParser | undefined;
  private valueParser: OddDataElementParser | undefined;

  constructor({
    parentPageParser,
    buttonElement,
  }: {
    parentPageParser: PageParser,
    buttonElement: p.ElementHandle,
  }) {
    this.parentPageParser = parentPageParser;
    this.wrappedButtonElement = buttonElement;
  }

  public async init(): Promise<Odd> {
    await this.initLinkers();
    await this.initElementParsers();
    await this.oddLinker.updateData();
    return this.odd;
  }

  private async initLinkers(): Promise<void> {
    this.gameLinker = await GameLinker.create({ parentOddHandleParser: this });
    this.statisticLinker = await StatisticLinker.create({ parentOddHandleParser: this });
    this.oddLinker = await OddLinker.create({ parentOddHandleParser: this });
  }

  private async initElementParsers(): Promise<void> {
    const priceElement = await this.buttonElement.$('.sportsbook-outcome-cell__elements');
    this.priceParser = await OddDataElementParser.create({ element: priceElement });

    const valueElement = await this.buttonElement.$('.sportsbook-outcome-cell__label-line-container');
    this.valueParser = await OddDataElementParser.create({ element: valueElement });
  }

  public get buttonElement(): p.ElementHandle {
    if (!this.wrappedButtonElement) {
      throw new Error(`wrappedButtonElement is undefined.`);
    }

    return this.wrappedButtonElement;
  }

  public get exchange(): Exchange {
    return this.parentPageParser.exchange;
  }

  public get exchangeAssignedGameId(): string {
    if (!this.gameLinker) {
      throw new Error(`gameLinker is undefined.`);
    }

    return this.gameLinker.exchangeAssignedGameId;
  }

  public get game(): Game {
    if (!this.gameLinker) {
      throw new Error(`gameLinker is undefined.`);
    }

    return this.gameLinker.game;
  }

  public get league(): League {
    return this.parentPageParser.league;
  }

  public get statistic(): Statistic {
    if (!this.statisticLinker) {
      throw new Error(`statisticLinker is undefined.`);
    }

    return this.statisticLinker.statistic;
  }

  public get odd(): Odd {
    if (!this.oddLinker) {
      throw new Error(`oddLinker is undefined.`);
    }

    return this.oddLinker.odd;
  }

  private set oddLinker(oddLinker: OddLinker) {
    this.wrappedOddLinker = oddLinker;
  }

  private get oddLinker(): OddLinker {
    if (!this.wrappedOddLinker) {
      throw new Error(`wrappedOddLinker is undefined.`);
    }

    return this.wrappedOddLinker;
  }

  public get price(): number | null {
    if (!this.priceParser) {
      throw new Error(`priceParser is undefined.`);
    }

    return this.priceParser.value
  }

  public get value(): number | null {
    if (!this.valueParser) {
      throw new Error(`valueParser is undefined.`);
    }

    return this.valueParser.value;
  }
}