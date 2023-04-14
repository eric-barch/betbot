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
    
        const moneyline = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'moneyline',
        });
        this.statisticSet.add(moneyline);
    
        const total = await globalModels.allStatistics.findOrCreate({
            game: game,
            name: 'total',
        })
        this.statisticSet.add(total);
    }

    return this.statisticSet;
}