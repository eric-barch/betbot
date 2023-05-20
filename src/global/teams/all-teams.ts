import { TeamDatum } from './team-datum';
import { mlbTeamData } from './mlb-team-data';
import { nbaTeamData } from './nba-team-data';
import { nflTeamData } from './nfl-team-data';

import * as db from '../../db';

export let mlbTeams: Map<string, db.models.Team> = new Map();
export let nbaTeams: Map<string, db.models.Team> = new Map();
export let nflTeams: Map<string, db.models.Team> = new Map();

export class AllTeams {
    public static async init() {
        console.log();
    
        const leagues = await db.models.League.findAll();
        
        for (const league of leagues) {
            switch (league.abbreviation) {
                case 'MLB':
                    await this.initLeagueTeams({
                        teamsMapReference: mlbTeams,
                        teamData: mlbTeamData,
                        league: league,
                    });
                    break;
                case 'NBA':
                    await this.initLeagueTeams({
                        teamsMapReference: nbaTeams,
                        teamData: nbaTeamData,
                        league: league,
                    });
                    break;
                case 'NFL':
                    await this.initLeagueTeams({
                        teamsMapReference: nflTeams,
                        teamData: nflTeamData,
                        league: league,
                    });
                    break;
                default:
                    throw new Error(`Did not find matching league.`);
            }
        }
    }

    private static async initLeagueTeams({
        teamsMapReference,
        teamData,
        league,
    }: {
        teamsMapReference: Map<string, db.models.Team>,
        teamData: Array<TeamDatum>,
        league: db.models.League
    }) {
        const findOrCreateTeam = async (teamInfo: TeamDatum, league: db.models.League) => {
            const [team, created] = await db.models.Team.findOrCreate({
                where: {
                    regionFull: teamInfo.regionFull,
                    nameFull: teamInfo.nameFull,
                    leagueId: league.id,
                },
                defaults: {
                    regionFull: teamInfo.regionFull,
                    regionAbbr: teamInfo.regionAbbr,
                    nameFull: teamInfo.nameFull,
                    nameAbbr: teamInfo.nameAbbr,
                    leagueId: league.id,
                },
            });
    
            if (!created) {
                await team.update({
                    regionAbbr: teamInfo.regionAbbr,
                    nameAbbr: teamInfo.nameAbbr,
                });
            }
    
            teamsMapReference.set(teamInfo.key, team);
        };
    
        const teamPromises = teamData.map((teamInfo) => findOrCreateTeam(teamInfo, league));
    
        await Promise.all(teamPromises);
    
        console.log(`${league.abbreviation} teams initialized.`);
    }
}