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
  private odd: Odd | undefined;
  private valueElement: p.ElementHandle | null | undefined;
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

    return this;
  }

  private async parseGame(): Promise<Game> {
    const exchange = this.exchange;
    const exchangeAssignedGameId = await this.parseExchangeAssignedGameId();

    this.game = await DbUtilityFunctions.findGameByExchangeAndExchangeAssignedGameId({
      exchange,
      exchangeAssignedGameId,
    });

    return this.game;
  }

  private async parseExchangeAssignedGameId(): Promise<string> {
    const dataTracking = await this.buttonElement.evaluate(el => el.getAttribute('data-tracking') || '');
    const parsedDataTracking = JSON.parse(dataTracking);
    const eventId = parsedDataTracking.eventId;
    return eventId;
  }

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