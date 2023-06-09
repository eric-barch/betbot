import { League } from '@prisma/client';
import { PageParser } from '../page-parser';
import { DbUtilityFunctions } from '@/db';

export class DbLeagueConnection {
  private parentPageParser: PageParser;
  private leagueName: string;
  private wrappedLeague: League | undefined;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
    this.leagueName = parentPageParser.leagueName;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<DbLeagueConnection> {
    const dbLeagueConnection = new DbLeagueConnection({ parentPageParser });
    await dbLeagueConnection.connect();
    return dbLeagueConnection;
  }

  private async connect(): Promise<DbLeagueConnection> {
    this.league = await DbUtilityFunctions.findLeagueByName({ name: this.leagueName });
    return this;
  }

  private set league(league: League) {
    this.wrappedLeague = league;
  }

  public get league(): League {
    if (!this.wrappedLeague) {
      throw new Error(`wrappedLeague is undefined.`);
    }

    return this.wrappedLeague;
  }
}