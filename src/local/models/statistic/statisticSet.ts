import * as localModels from '../../../local';

import { Statistic } from './statistic';

export class StatisticSet extends Set<Statistic> {
    public async findOrCreate({
        game,
        name,
    }: {
        game: localModels.Game,
        name: string,
    }): Promise<Statistic> {
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

        const updateOddsFunction = localModels.statistic.updateFunctionsMap.get(`${name}`);

        if (!updateOddsFunction) {
            throw new Error(`Did not find updateOddsFunction.`);
        }

        if (!requestedStatistic) {
            requestedStatistic = await Statistic.create({
                game: game,
                name: name,
                updateOddsFunction: updateOddsFunction,
            });

            this.add(requestedStatistic);
        }

        return requestedStatistic;
    }
}