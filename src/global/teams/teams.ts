import * as db from '../../db';
import * as global from '../../global';
import { mlbTeamData } from './mlbTeamData';
import { nbaTeamData } from './nbaTeamData';
import { nflTeamData } from './nflTeamData';

export interface TeamDatum {
    key: string,
    regionFull: string,
    regionAbbr: string,
    nameFull: string,
    nameAbbr: string,
}

export let mlbTeams: Map<string, db.Team> = new Map();
export let nbaTeams: Map<string, db.Team> = new Map();
export let nflTeams: Map<string, db.Team> = new Map();

export async function init() {
    const leagues = await db.League.findAll();
    
    for (const league of leagues) {
        switch (league.id) {
            case global.leagues.mlb.id:
                await initLeagueTeams({
                    teamsMapReference: mlbTeams,
                    teamData: mlbTeamData,
                    league: league,
                });
                console.log(`MLB teams initialized.`);
                break;
            case global.leagues.nba.id:
                await initLeagueTeams({
                    teamsMapReference: nbaTeams,
                    teamData: nbaTeamData,
                    league: league,
                });
                console.log(`NBA teams initialized.`);
                break;
            case global.leagues.nfl.id:
                await initLeagueTeams({
                    teamsMapReference: nflTeams,
                    teamData: nflTeamData,
                    league: league,
                });
                console.log(`NFL teams initialized.`);
                break;
            default:
                throw new Error(`Did not find matching league.`);
        }
    }
}

async function initLeagueTeams({
    teamsMapReference,
    teamData,
    league,
}: {
    teamsMapReference: Map<string, db.Team>,
    teamData: Array<TeamDatum>,
    league: db.League
}) {
    const findOrCreateTeam = async (teamInfo: TeamDatum, league: db.League) => {
        const [team, created] = await db.Team.findOrCreate({
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
}