import { Statistic } from './statistic';

import * as localModels from '../../../local';

export class StatisticSet extends Set<Statistic> {
    public async findOrCreate({
        game,
        name,
    }: {
        game: localModels.Game,
        name: string,
    }) {
        let requestedStatistic = null;

        for (const statistic of this) {
            if (statistic.matches({
                game: game,
                name: name,
            })) {
                requestedStatistic = statistic;
                break;
            }
        }

        if (!requestedStatistic) {
            requestedStatistic = await Statistic.create({
                game: game,
                name: name,
            });

            this.add(requestedStatistic);
        }

        return requestedStatistic;
    }
}