import { ActiveModels } from '../active-models';
import { Team } from '@prisma/client';
import { League } from '@prisma/client';
import { teamsDataByLeague } from './team-data';
import { ITeamData } from './team-data/i-team-data';
import { prisma } from '../../prisma-client';
import { activeLeagues } from '../active-leagues';


class ActiveTeams extends ActiveModels<Team> {
  protected async initActiveModels(): Promise<Array<Team>> {
    const teams = new Array<Team>;

    const leagues = activeLeagues.active;

    for (const league of leagues) {
      const leagueAbbreviation = league.abbreviation;

      let leagueTeams: Array<Team>;

      switch (leagueAbbreviation) {
        case 'MLB':
          leagueTeams = await this.initLeagueTeams({ league, teamsData: teamsDataByLeague.mlb });
          break;
        case 'NBA':
          leagueTeams = await this.initLeagueTeams({ league, teamsData: teamsDataByLeague.nba });
          break;
        case 'NFL':
          leagueTeams = await this.initLeagueTeams({ league, teamsData: teamsDataByLeague.nfl });
          break;
        default:
          throw new Error(`Did not find matching teamsData for league.`);
      }

      for (const leagueTeam of leagueTeams) {
        teams.push(leagueTeam);
      }
    }

    return teams;
  }

  private async initLeagueTeams({
    league,
    teamsData,
  }: {
    league: League,
    teamsData: Array<ITeamData>,
  }): Promise<Array<Team>> {
    const teams = new Array<Team>

    for (const teamData of teamsData) {
      let team: Team;

      try {
        team = await prisma.team.findFirstOrThrow({
          where: {
            league,
            regionFull: teamData.regionFull,
            identifierFull: teamData.identifierFull,
          }
        });

        team = await prisma.team.update({
          where: { id: team.id },
          data: {
            regionAbbr: teamData.regionAbbr,
            identifierAbbr: teamData.identifierAbbr,
          }
        })
      } catch (e) {
        team = await prisma.team.create({
          data: {
            league: { connect: { id: league.id } },
            regionFull: teamData.regionFull,
            regionAbbr: teamData.regionAbbr,
            identifierFull: teamData.identifierFull,
            identifierAbbr: teamData.identifierAbbr,
          }
        })
      }

      teams.push(team);
    }

    return teams;
  }
}

export const activeTeams = new ActiveTeams();