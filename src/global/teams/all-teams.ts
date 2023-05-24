import { allLeagues } from '../leagues';
import { TeamDatum } from './team-datum';
import { mlbTeamData } from './mlb-team-data';
import { nbaTeamData } from './nba-team-data';
import { nflTeamData } from './nfl-team-data';
import { IGlobal } from '../i-global';

import * as db from '../../db';

class AllTeams implements IGlobal<db.models.Team> {
  private wrappedActive: Array<db.models.Team>;

  constructor() {
    this.wrappedActive = new Array<db.models.Team>();
  }

  public async init(): Promise<Array<db.models.Team>> {
    const leagues = allLeagues.active;

    for (const league of leagues) {
      switch (league.id) {
        case allLeagues.mlb.id:
          await this.initLeagueTeams({
            teamData: mlbTeamData,
            league: league,
          });
          break;
        case allLeagues.nba.id:
          await this.initLeagueTeams({
            teamData: nbaTeamData,
            league: league,
          });
          break;
        case allLeagues.nfl.id:
          await this.initLeagueTeams({
            teamData: nflTeamData,
            league: league,
          });
          break;
        default:
          throw new Error(`Did not find matching league.`);
      }
    }

    return this.wrappedActive;
  }

  private async initLeagueTeams({
    teamData,
    league,
  }: {
    teamData: Array<TeamDatum>;
    league: db.models.League;
  }) {
    for (const teamDatum of teamData) {
      const [team, created] = await db.models.Team.findOrCreate({
        where: {
          regionFull: teamDatum.regionFull,
          nameFull: teamDatum.nameFull,
          leagueId: league.id,
        },
        defaults: {
          regionFull: teamDatum.regionFull,
          regionAbbr: teamDatum.regionAbbr,
          nameFull: teamDatum.nameFull,
          nameAbbr: teamDatum.nameAbbr,
          leagueId: league.id,
        },
      });

      if (!created) {
        await team.update({
          regionAbbr: teamDatum.regionAbbr,
          nameAbbr: teamDatum.nameAbbr,
        });
      }

      this.wrappedActive.push(team);
    }
  }

  get active(): Array<db.models.Team> {
    return this.wrappedActive;
  }
}

export const allTeams = new AllTeams();
