import * as localModels from '../../../../../local';

import { updateOddElementsFunctions } from '../updateOddElements/fanDuel';

export async function spreadAway({
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}): Promise<localModels.OddSet> {
    const updateOverOddElementsFunction = updateOddElementsFunctions.get(`spread_away_over`);

    if (!updateOverOddElementsFunction) {
        throw new Error(`Did not find function`);
    }

    const overOddExists = await updateOverOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });

    if (overOddExists) {
        const overOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Over,
            updateOddElementsFunction: updateOverOddElementsFunction,
        });
        exchange.oddSet.add(overOdd);
        statistic.oddSet.add(overOdd);
    }

    const updateUnderOddElementsFunction = updateOddElementsFunctions.get(`spread_away_under`);
    
    if (!updateUnderOddElementsFunction) {
        throw new Error(`Did not find function`);
    }

    const underOddExists = await updateUnderOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });

    if (underOddExists) {
        const underOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Under,
            updateOddElementsFunction: updateUnderOddElementsFunction,
        });
        exchange.oddSet.add(underOdd);
        statistic.oddSet.add(underOdd);
    }

    return exchange.oddSet;
}

export async function spreadHome({
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}): Promise<localModels.OddSet> {
    const updateOverOddElementsFunction = updateOddElementsFunctions.get(`spread_home_over`);

    if (!updateOverOddElementsFunction) {
        throw new Error(`Did not find function`);
    }

    const overOddExists = await updateOverOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });

    if (overOddExists) {
        const overOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Over,
            updateOddElementsFunction: updateOverOddElementsFunction,
        });
        exchange.oddSet.add(overOdd);
        statistic.oddSet.add(overOdd);
    }

    const updateUnderOddElementsFunction = updateOddElementsFunctions.get(`spread_home_under`);
    
    if (!updateUnderOddElementsFunction) {
        throw new Error(`Did not find function`);
    }

    const underOddExists = await updateUnderOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });

    if (underOddExists) {
        const underOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Under,
            updateOddElementsFunction: updateUnderOddElementsFunction,
        });
        exchange.oddSet.add(underOdd);
        statistic.oddSet.add(underOdd);
    }

    return exchange.oddSet;
}

export async function moneyline({
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}) {
    const updateAwayOddElementsFunction = updateOddElementsFunctions.get(`moneyline_away`);

    if (!updateAwayOddElementsFunction) {
        throw new Error(`Did not find function`);
    }

    const awayOddExists = await updateAwayOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });

    if (awayOddExists) {
        const awayOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            value: 'away',
            updateOddElementsFunction: updateAwayOddElementsFunction,
        });
        exchange.oddSet.add(awayOdd);
        statistic.oddSet.add(awayOdd);
    }

    const updateHomeOddElementsFunction = updateOddElementsFunctions.get(`moneyline_home`);

    if (!updateHomeOddElementsFunction) {
        throw new Error(`Did not find function`);
    }

    const homeOddExists = await updateHomeOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });

    if (homeOddExists) {
        const homeOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            value: 'home',
            updateOddElementsFunction: updateHomeOddElementsFunction,
        });
        exchange.oddSet.add(homeOdd);
        statistic.oddSet.add(homeOdd);
    }

    return exchange.oddSet;
}

export async function total({
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}): Promise<localModels.OddSet> {
    const updateOverOddElementsFunction = updateOddElementsFunctions.get(`total_over`);

    if (!updateOverOddElementsFunction) {
        throw new Error(`Did not find function`);
    }

    const overOddExists = await updateOverOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });

    if (overOddExists) {
        const overOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Over,
            updateOddElementsFunction: updateOverOddElementsFunction,
        });
        exchange.oddSet.add(overOdd);
        statistic.oddSet.add(overOdd)
    }

    const updateUnderOddElementsFunction = updateOddElementsFunctions.get(`total_under`);

    if (!updateUnderOddElementsFunction) {
        throw new Error(`Did not find function`);
    }

    const underOddExists = await updateUnderOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });

    if (underOddExists) {
        const underOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Under,
            updateOddElementsFunction: updateUnderOddElementsFunction,
        });
        exchange.oddSet.add(underOdd);
        statistic.oddSet.add(underOdd);
    }

    return exchange.oddSet;
}