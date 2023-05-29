import { ActiveModels } from '../active-models';
import { League } from '@prisma/client';
import { leaguesData } from './league-data';
import { prisma } from '../../prisma-client';

class ActiveLeagues extends ActiveModels<League> {
  protected async initActiveModels(): Promise<Array<League>> {
    const leagues = new Array<League>;

    for (const leagueData of leaguesData) {
      let league: League;

      try {
        league = await prisma.league.findFirstOrThrow({
          where: {
            name: leagueData.name,
            abbreviation: leagueData.abbreviation,
          },
        });
      } catch (e) {
        league = await prisma.league.create({
          data: {
            name: leagueData.name,
            abbreviation: leagueData.abbreviation,
          }
        })
      }

      leagues.push(league);
    }

    return leagues;
  }
}

export const activeLeagues = new ActiveLeagues();
