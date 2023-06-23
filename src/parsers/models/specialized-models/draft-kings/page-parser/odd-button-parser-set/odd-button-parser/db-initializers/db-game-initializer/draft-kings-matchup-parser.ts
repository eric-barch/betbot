import { Team } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { DbUtilityFunctions } from '@/db';
import { DbGameInitializer, OddButtonParser } from '@/parsers/models/common-models';

export class DraftKingsMatchupParser {
  private readonly parentDbGameInitializer: DbGameInitializer;
  private wrappedTeamRowElement: ElementHandle | undefined;
  private wrappedGameLinkElement: ElementHandle | undefined;
  private wrappedGameLinkString: string | undefined;
  private wrappedAwayTeam: Team | undefined;
  private wrappedHomeTeam: Team | undefined;

  private constructor({
    parentDbGameInitializer,
  }: {
    parentDbGameInitializer: DbGameInitializer,
  }) {
    this.parentDbGameInitializer = parentDbGameInitializer;
  }

  public static async create({
    parentDbGameInitializer,
  }: {
    parentDbGameInitializer: DbGameInitializer,
  }): Promise<DraftKingsMatchupParser> {
    const matchupParser = new DraftKingsMatchupParser({ parentDbGameInitializer });
    await matchupParser.init();
    return matchupParser;
  }

  private async init(): Promise<DraftKingsMatchupParser> {
    this.gameLinkString = await this.getGameLinkString();
    await this.parseGameLinkString();
    return this;
  }

  private async getGameLinkString(): Promise<string> {
    await this.updateGameLinkElement();

    const gameLinkString = await this.gameLinkElement.evaluate(el => el.getAttribute('href'));

    if (!gameLinkString) {
      throw new Error(`gameLinkString is null.`);
    }

    this.gameLinkString = gameLinkString;

    return this.gameLinkString;
  }

  private async updateGameLinkElement(): Promise<ElementHandle> {
    await this.updateTeamRowElement();

    const gameLinkElement = await this.teamRowElement.$('.event-cell-link');

    if (!gameLinkElement) {
      throw new Error(`gameLinkElement is null.`);
    }

    this.gameLinkElement = gameLinkElement;

    return this.gameLinkElement;
  }

  private async updateTeamRowElement(): Promise<ElementHandle> {
    let ancestor = this.parentDbGameInitializer.button;

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

  private async parseGameLinkString(): Promise<void> {
    const teamNamesMatchPattern = new RegExp(/\/([^/]+)%40([^/]+)\//);
    const teamNameMatches = teamNamesMatchPattern.exec(this.gameLinkString);

    if (!teamNameMatches) {
      throw new Error(`teamNameMatches is null.`);
    }

    const league = this.parentDbGameInitializer.league;

    this.awayTeam = await DbUtilityFunctions.findTeamByUnformattedNameAndLeague({
      league,
      unformattedName: teamNameMatches[1],
    });

    this.homeTeam = await DbUtilityFunctions.findTeamByUnformattedNameAndLeague({
      league,
      unformattedName: teamNameMatches[2],
    });
  }

  private get teamRowElement(): ElementHandle {
    if (!this.wrappedTeamRowElement) {
      throw new Error(`wrappedTeamRowElement is undefined.`);
    }

    return this.wrappedTeamRowElement;
  }

  private set teamRowElement(teamRowElement: ElementHandle) {
    this.wrappedTeamRowElement = teamRowElement;
  }

  private get gameLinkElement(): ElementHandle {
    if (!this.wrappedGameLinkElement) {
      throw new Error(`wrappedGameLinkElement is undefined.`);
    }

    return this.wrappedGameLinkElement;
  }

  private set gameLinkElement(gameLinkElement: ElementHandle) {
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