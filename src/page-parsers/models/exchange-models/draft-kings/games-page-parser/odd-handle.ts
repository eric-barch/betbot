import * as c from 'chrono-node';
import * as p from 'puppeteer';

import { prisma, DbUtilityFunctions } from '@/db';
import { Exchange, Game, Odd, Statistic } from '@prisma/client';
import { OddHandleSet } from './odd-handle-set';

export class OddHandle {
  private oddHandleSet: OddHandleSet;
  private buttonElement: p.ElementHandle;
  private exchange: Exchange;
  private wrappedGame: Game | undefined;
  private wrappedStatistic: Statistic | undefined;
  private wrappedOdd: Odd | undefined;
  private wrappedValueElement: p.ElementHandle | null | undefined;
  private wrappedPriceElement: p.ElementHandle | undefined;

  constructor({
    buttonElement,
    oddHandleSet,
  }: {
    buttonElement: p.ElementHandle,
    oddHandleSet: OddHandleSet,
  }) {
    this.buttonElement = buttonElement;
    this.oddHandleSet = oddHandleSet;
    this.exchange = oddHandleSet.exchange;
  }

  public async init(): Promise<OddHandle> {
    this.valueElement = await this.buttonElement.$('.sportsbook-outcome-cell__label-line-container');
    this.priceElement = await this.buttonElement.$('.sportsbook-outcome-cell__elements');

    await this.parseGame();
    await this.parseStatistic();
    await this.parseOdd();

    return this;
  }

  private async parseGame(): Promise<Game> {
    const exchange = this.exchange;
    const exchangeAssignedGameId = await this.parseExchangeAssignedGameId();

    try {
      this.game = await DbUtilityFunctions.findGameByExchangeAndExchangeAssignedGameId({
        exchange,
        exchangeAssignedGameId,
      });
    } catch (e) {
      const startDate = await this.parseStartDate();
      // const matchup = await this.parseMatchup();

      // this.game = await DbUtilityFunctions.findOrCreateGameByMatchupAndStartDate({
      //   awayTeam: matchup.awayTeam,
      //   homeTeam: matchup.homeTeam,
      //   startDate,
      // });

      // await DbUtilityFunctions.associateExchangeAndGameByExchangeAssignedGameId({
      //   exchange,
      //   game: this.game,
      //   exchangeAssignedGameId,
      // });
    }

    return this.game;
  }

  private async parseExchangeAssignedGameId(): Promise<string> {
    const dataTracking = await this.buttonElement.evaluate(el => el.getAttribute('data-tracking') || '');
    const parsedDataTracking = JSON.parse(dataTracking);
    const eventId = parsedDataTracking.eventId;
    return eventId;
  }

  private async parseStartDate(): Promise<Date> {
    const dateString = await this.parseDateString();
    const timeString = await this.parseTimeString();
    const startDateString = `${dateString} ${timeString}`;
    const startDate = c.parseDate(startDateString);
    return startDate;
  }

  private async parseDateString(): Promise<string> {
    const dateTableElement = await this.getDateTableElement();
    const dateTableHeaderElement = await dateTableElement.$('.always-left.column-header');

    if (!dateTableHeaderElement) {
      throw new Error(`dateTableHeaderElement is null.`);
    }

    const dateString = await (await dateTableHeaderElement.getProperty('textContent')).jsonValue();

    if (!dateString) {
      throw new Error(`dateString is null.`);
    }

    return dateString;
  }

  private async getDateTableElement(): Promise<p.ElementHandle> {
    let ancestor = this.buttonElement;

    const classNameToFind = 'parlay-card-10-a';

    while (ancestor) {
      const className = await (await ancestor.getProperty('className')).jsonValue();

      if (className === classNameToFind) {
        return ancestor;
      }

      const parentElement = await ancestor.$('xpath/..');

      if (!parentElement) {
        throw new Error(`parentElement is null.`);
      }

      ancestor = parentElement;
    }

    throw new Error(`Did not find dateTableElement.`);
  }

  private async parseTimeString(): Promise<string> {
    const teamRowElement = await this.getTeamRowElement();
    const timeElement = await teamRowElement.$('.event-cell__start-time');

    if (!timeElement) {
      throw new Error(`timeElement is null.`);
    }

    const timeString = await (await timeElement.getProperty('textContent')).jsonValue();

    if (!timeString) {
      throw new Error(`timeString is null.`);
    }

    return timeString;
  }

  private async getTeamRowElement(): Promise<p.ElementHandle> {
    let ancestor = this.buttonElement;

    const nodeNameToFind = 'tr';

    while (ancestor) {
      const nodeName = await (await ancestor.getProperty('nodeName')).jsonValue();

      if (nodeName.toLowerCase() === nodeNameToFind) {
        return ancestor;
      }

      const parentElement = await ancestor.$('xpath/..');

      if (!parentElement) {
        throw new Error(`parentElement is null.`);
      }

      ancestor = parentElement;
    }

    throw new Error(`Did not find teamRowElement.`);
  }

  // private async parseMatchup(): Promise<{
  //   awayTeam: Team,
  //   homeTeam: Team,
  // }> {

  // }

  private async parseStatistic(): Promise<Statistic> {
    const game = this.game;
    const statisticName = await this.parseStatisticName();

    this.statistic = await DbUtilityFunctions.findOrCreateStatisticByGameAndStatisticName({
      game,
      statisticName,
    });

    return this.statistic;
  }

  private async parseStatisticName(): Promise<string> {
    const ariaLabel = await this.getAriaLabel();

    const awayTeam = await prisma.team.findFirstOrThrow({ where: { id: this.game.awayTeamId } });
    const homeTeam = await prisma.team.findFirstOrThrow({ where: { id: this.game.homeTeamId } });

    const spreadPattern = new RegExp(`^.*\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b[^\\w\\d]*([+-]?\\d+\\.\\d)+?.*`, "i");
    const totalPattern = new RegExp("^.*\\b(O|U|Over|Under)\\b[^\\w\\d]*(\\d+(\\.\\d+)?).*$", "i");
    const winnerPattern = new RegExp(`^.*\\b(${awayTeam.identifierFull}|${homeTeam.identifierFull})\\b[^0-9]*$`, "i");

    const spreadPatternMatches = spreadPattern.exec(ariaLabel);
    const totalPatternMatches = totalPattern.exec(ariaLabel);
    const winnerPatternMatches = winnerPattern.exec(ariaLabel);

    if (spreadPatternMatches) {
      return (spreadPatternMatches[1] === awayTeam.identifierFull) ? 'spread_away' : 'spread_home';
    } else if (totalPatternMatches) {
      return (totalPatternMatches[1].toUpperCase().startsWith('O')) ? 'total_over' : 'total_under';
    } else if (winnerPatternMatches) {
      return (winnerPatternMatches[1] === awayTeam.identifierFull) ? 'winner_away' : 'winner_home';
    }

    throw new Error(`Did not find matching statistic name.`);
  }

  private async parseOdd(): Promise<Odd> {
    const exchange = this.exchange;
    const statistic = this.statistic;

    this.odd = await DbUtilityFunctions.findOrCreateOddByExchangeAndStatistic({
      exchange,
      statistic,
    });

    return this.odd;
  }

  private async getAriaLabel(): Promise<string> {
    const ariaLabel = await (await this.buttonElement.getProperty('ariaLabel')).jsonValue();

    if (!ariaLabel) {
      throw new Error(`ariaLabel is null.`)
    }

    return ariaLabel;
  }

  private get game(): Game {
    if (!this.wrappedGame) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }

  private set game(game: Game) {
    this.wrappedGame = game;
  }

  private get statistic(): Statistic {
    if (!this.wrappedStatistic) {
      throw new Error(`wrappedStatistic is undefined.`);
    }

    return this.wrappedStatistic;
  }

  private set statistic(statistic: Statistic) {
    this.wrappedStatistic = statistic;
  }

  private get odd(): Odd {
    if (!this.wrappedOdd) {
      throw new Error(`wrappedOdd is undefined.`);
    }

    return this.wrappedOdd;
  }

  private set odd(odd: Odd) {
    this.wrappedOdd = odd;
  }

  private get valueElement(): p.ElementHandle | null {
    if (this.wrappedValueElement === undefined) {
      throw new Error(`wrappedValueElement is undefined.`);
    }

    return this.wrappedValueElement;
  }

  private set valueElement(valueElement: p.ElementHandle | null) {
    this.wrappedValueElement = valueElement;
  }

  private get priceElement(): p.ElementHandle {
    if (!this.wrappedPriceElement) {
      throw new Error(`wrappedPriceElement is undefined.`);
    }

    return this.wrappedPriceElement;
  }

  private set priceElement(priceElement: p.ElementHandle | null) {
    if (!priceElement) {
      throw new Error(`priceElement cannot be null.`);
    }

    this.wrappedPriceElement = priceElement;
  }
}