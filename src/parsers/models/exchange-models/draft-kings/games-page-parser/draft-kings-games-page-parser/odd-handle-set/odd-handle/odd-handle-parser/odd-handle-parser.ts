import * as p from 'puppeteer';

import { PageParser } from '@/parsers';
import { Exchange, Game, League, Odd, Statistic } from '@prisma/client';
import { PriceParser, ValueParser } from './data-parsers';
import { DbGameLink, DbOddLink, DbStatisticLink } from './db-links';
import { OddHandleSet } from '../../odd-handle-set';

export class OddHandleParser {
  private parentPageParser: PageParser;
  private parentOddHandleSet: OddHandleSet;
  private wrappedButtonElement: p.ElementHandle | null;
  private dbGameLink: DbGameLink | undefined;
  private dbStatisticLink: DbStatisticLink | undefined;
  private wrappedDbOddLink: DbOddLink | undefined;
  private wrappedPriceParser: PriceParser | undefined;
  private wrappedValueParser: ValueParser | undefined;

  public constructor({
    parentPageParser,
    parentOddHandleSet,
    buttonElement,
  }: {
    parentPageParser: PageParser,
    parentOddHandleSet: OddHandleSet,
    buttonElement: p.ElementHandle,
  }) {
    this.parentPageParser = parentPageParser;
    this.parentOddHandleSet = parentOddHandleSet;
    this.wrappedButtonElement = buttonElement;
  }

  public async init(): Promise<OddHandleParser> {
    await this.initDbLinks();
    await this.initDataParsers();
    await this.oddLinker.updateData();
    return this;
  }

  private async initDbLinks(): Promise<void> {
    this.dbGameLink = await DbGameLink.create({ parentOddHandleParser: this });
    this.dbStatisticLink = await DbStatisticLink.create({ parentOddHandleParser: this });
    this.oddLinker = await DbOddLink.create({ parentOddHandleParser: this });
  }

  private async initDataParsers(): Promise<void> {
    const foo = await PriceParser.create({ parentOddHandleParser: this });
    this.priceParser = foo;

    const bar = await ValueParser.create({ parentOddHandleParser: this });
    this.valueParser = bar;
  }

  public async update(): Promise<OddHandleParser> {
    await this.updateButtonElement();
    await this.updateDataParsers();
    await this.oddLinker.updateData();
    return this;
  }

  private async updateButtonElement(): Promise<p.ElementHandle | null> {
    const buttonElements = this.parentOddHandleSet.buttonElements;

    const ariaLabelRegExp = new RegExp('foo');
    const exchangeAssignedGameId = this.exchangeAssignedGameId;

    for (const buttonElement of buttonElements) {
      const ariaLabel = await buttonElement.evaluate(el => el.getAttribute('aria-label') || '');
      const dataTracking = await buttonElement.evaluate(el => JSON.parse(el.getAttribute('data-tracking') || ''));

      const ariaLabelMatches = (ariaLabelRegExp.test(ariaLabel));
      const idMatches = (dataTracking && dataTracking.eventId === exchangeAssignedGameId);

      if (ariaLabelMatches && idMatches) {
        return buttonElement;
      }
    }

    return null;
  }

  private async updateDataParsers(): Promise<void> {
    await this.priceParser.update();
    await this.valueParser.update();
  }

  public get buttonElement(): p.ElementHandle | null {
    return this.wrappedButtonElement;
  }

  public get exchange(): Exchange {
    return this.parentPageParser.exchange;
  }

  public get exchangeAssignedGameId(): string {
    if (!this.dbGameLink) {
      throw new Error(`gameLinker is undefined.`);
    }

    return this.dbGameLink.exchangeAssignedGameId;
  }

  public get game(): Game {
    if (!this.dbGameLink) {
      throw new Error(`gameLinker is undefined.`);
    }

    return this.dbGameLink.game;
  }

  public get league(): League {
    return this.parentPageParser.league;
  }

  public get price(): number | null {
    if (!this.priceParser) {
      throw new Error(`priceParser is undefined.`);
    }

    return this.priceParser.value
  }

  private set priceParser(priceParser: PriceParser) {
    this.wrappedPriceParser = priceParser;
  }

  private get priceParser(): PriceParser {
    if (!this.wrappedPriceParser) {
      throw new Error(`wrappedPriceParser is undefined.`);
    }

    return this.wrappedPriceParser;
  }

  public get statistic(): Statistic {
    if (!this.dbStatisticLink) {
      throw new Error(`statisticLinker is undefined.`);
    }

    return this.dbStatisticLink.statistic;
  }

  public get odd(): Odd {
    if (!this.oddLinker) {
      throw new Error(`oddLinker is undefined.`);
    }

    return this.oddLinker.odd;
  }

  private set oddLinker(oddLinker: DbOddLink) {
    this.wrappedDbOddLink = oddLinker;
  }

  private get oddLinker(): DbOddLink {
    if (!this.wrappedDbOddLink) {
      throw new Error(`wrappedOddLinker is undefined.`);
    }

    return this.wrappedDbOddLink;
  }

  public get value(): number | null {
    if (!this.valueParser) {
      throw new Error(`valueParser is undefined.`);
    }

    return this.valueParser.value;
  }

  private set valueParser(valueParser: ValueParser) {
    this.wrappedValueParser = valueParser;
  }

  private get valueParser(): ValueParser {
    if (!this.wrappedValueParser) {
      throw new Error(`wrappedValueParser is undefined.`);
    }

    return this.wrappedValueParser;
  }
}