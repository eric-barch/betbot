import * as globalModels from '../../../../../global';
import * as localModels from '../../../../../local';

export async function updateStatistics(this: localModels.Exchange): Promise<localModels.StatisticSet> {
    for (const game of this.gameSet) {
        const spreadAway = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'spread_away',
        });
        this.statisticSet.add(spreadAway);
    
        const spreadHome = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'spread_home',
        });
        this.statisticSet.add(spreadHome);

        const moneylineAway = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'moneyline_away',
        });
        this.statisticSet.add(moneylineAway);

        const moneylineHome = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'moneyline_home',
        });
        this.statisticSet.add(moneylineHome);

        const totalOver = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'total_over',
        })
        this.statisticSet.add(totalOver);

        const totalUnder = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'total_under',
        })
        this.statisticSet.add(totalUnder);
    }

    return this.statisticSet;
}