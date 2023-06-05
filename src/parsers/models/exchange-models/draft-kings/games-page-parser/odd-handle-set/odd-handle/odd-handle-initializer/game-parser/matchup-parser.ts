import * as p from 'puppeteer';

import { Odd, Team } from '@prisma/client';
import { GameWithoutExchangeAssignedIdParser } from './game-without-exchange-assigned-id-parser';
import { DbUtilityFunctions } from '@/db';
import { OddHandle } from '../../odd-handle';

export class MatchupParser {
  private parentOddHandle: OddHandle;
  private wrappedTeamRowElement: p.ElementHandle | undefined;
  private wrappedGameLinkElement: p.ElementHandle | undefined;
  private wrappedGameLinkString: string | undefined;
  private wrappedAwayTeam: Team | undefined;
  private wrappedHomeTeam: Team | undefined;

  constructor({
    parentOddHandle,
  }: {
    parentOddHandle: OddHandle,
  }) {
    this.parentOddHandle = parentOddHandle;
  }

  public async parse(): Promise<{
    awayTeam: Team,
    homeTeam: Team,
  }> {
    await this.updateGameLinkString();
    await this.parseGameLinkString();

    return {
      awayTeam: this.awayTeam,
      homeTeam: this.homeTeam,
    }
  }

  private async updateGameLinkString(): Promise<string> {
    await this.updateGameLinkElement();

    const gameLinkString = await this.gameLinkElement.evaluate(el => el.getAttribute('href'));

    if (!gameLinkString) {
      throw new Error(`gameLinkString is null.`);
    }

    this.gameLinkString = gameLinkString;

    return this.gameLinkString;
  }

  private async updateGameLinkElement(): Promise<p.ElementHandle> {
    await this.updateTeamRowElement();

    const gameLinkElement = await this.teamRowElement.$('.event-cell-link');

    if (!gameLinkElement) {
      throw new Error(`gameLinkElement is null.`);
    }

    this.gameLinkElement = gameLinkElement;

    return this.gameLinkElement;
  }

  private async updateTeamRowElement(): Promise<p.ElementHandle> {
    let ancestor = this.buttonElement;

    const nodeNameToFind = 'tr';

    while (ancestor) {
      const nodeName = await (await ancestor.getProperty('nodeName')).jsonValue();

      if (nodeName.toLowerCase() === nodeNameToFind) {
        this.teamRowElement = ancestor;
        return this.teamRowElement;
      }

      const parentElement = await ancestor.$('xpath/..');

      if (!parentElement) {
        throw new Error(`parentElement is null.`);
      }

      ancestor = parentElement;
    }

    throw new Error(`Did not find teamRowElement.`);
  }

  private async parseGameLinkString(): Promise<{
    awayTeam: Team,
    homeTeam: Team,
  }> {
    const teamNamesMatchPattern = new RegExp(/\/([^/]+)%40([^/]+)\//);
    const teamNameMatches = teamNamesMatchPattern.exec(this.gameLinkString);

    if (!teamNameMatches) {
      throw new Error(`teamNameMatches is null.`);
    }

    const league = this.parentOddHandle.league;

    this.awayTeam = await DbUtilityFunctions.findTeamByLeagueAndUnformattedName({
      league,
      unformattedName: teamNameMatches[1],
    });

    this.awayTeam = await DbUtilityFunctions.findTeamByLeagueAndUnformattedName({
      league,
      unformattedName: teamNameMatches[2],
    })

    return {
      awayTeam: this.awayTeam,
      homeTeam: this.homeTeam,
    };
  }

  public get buttonElement(): p.ElementHandle {
    return this.parentOddHandle.buttonElement;
  }

  private get teamRowElement(): p.ElementHandle {
    if (!this.wrappedTeamRowElement) {
      throw new Error(`wrappedTeamRowElement is undefined.`);
    }

    return this.wrappedTeamRowElement;
  }

  private set teamRowElement(teamRowElement: p.ElementHandle) {
    this.wrappedTeamRowElement = teamRowElement;
  }

  private get gameLinkElement(): p.ElementHandle {
    if (!this.wrappedGameLinkElement) {
      throw new Error(`wrappedGameLinkElement is undefined.`);
    }

    return this.wrappedGameLinkElement;
  }

  private set gameLinkElement(gameLinkElement: p.ElementHandle) {
    this.wrappedGameLinkElement = gameLinkElement;
  }

  private get gameLinkString(): string {
    if (!this.wrappedGameLinkString) {
      throw new Error(`wrappedGameLinkString is undefined.`);
    }

    return this.wrappedGameLinkString;
  }

  private set gameLinkString(gameLinkString: string) {
    this.wrappedGameLinkString = gameLinkString;
  }

  public get awayTeam(): Team {
    if (!this.wrappedAwayTeam) {
      throw new Error(`wrappedAwayTeam is undefined.`);
    }

    return this.wrappedAwayTeam;
  }

  private set awayTeam(awayTeam: Team) {
    this.wrappedAwayTeam = awayTeam;
  }

  public get homeTeam(): Team {
    if (!this.wrappedHomeTeam) {
      throw new Error(`wrappedHomeTeam is undefined.`);
    }

    return this.wrappedHomeTeam;
  }

  private set homeTeam(homeTeam: Team) {
    this.wrappedHomeTeam = homeTeam;
  }
}