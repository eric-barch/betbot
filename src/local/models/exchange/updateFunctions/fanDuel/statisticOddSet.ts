import * as localModels from '../../../../../local';

export const map = new Map<string, Function>([
    ['spread_away', spreadAway],
    ['spread_home', spreadHome],
    ['moneyline', moneyline],
    ['total', total],
]);

export async function spreadAway({
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}) {
    const spreadAwayOverKey = `${statistic.name}_over`;
    const spreadAwayOverFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadAwayOverKey);

    if (!spreadAwayOverFunction) {
        throw new Error(`Did not find function.`);
    }

    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Over,
        updateFunction: spreadAwayOverFunction,
    });

    const spreadAwayUnderKey = `${statistic.name}_under`;
    const spreadAwayUnderFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadAwayUnderKey);

    if (!spreadAwayUnderFunction) {
        throw new Error(`Did not find function.`);
    }

    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Under,
        updateFunction: spreadAwayUnderFunction,
    });
}

export async function spreadHome({
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}) {
    const spreadHomeOverKey = `${statistic.name}_over`;
    const spreadHomeOverFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadHomeOverKey);

    if (!spreadHomeOverFunction) {
        throw new Error(`Did not find function.`);
    }

    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Over,
        updateFunction: spreadHomeOverFunction,
    });

    const spreadHomeUnderKey = `${statistic.name}_under`;
    const spreadHomeUnderFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadHomeUnderKey);

    if (!spreadHomeUnderFunction) {
        throw new Error(`Did not find function.`);
    }

    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Under,
        updateFunction: spreadHomeUnderFunction,
    });
}

export async function moneyline({
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}) {
    const moneylineAwayKey = `${statistic.name}_away`;
    const moneylineAwayFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(moneylineAwayKey);

    if (!moneylineAwayFunction) {
        throw new Error(`Did not find function.`);
    }

    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        value: 'away',
        updateFunction: moneylineAwayFunction,
    });

    const moneylineHomeKey = `${statistic.name}_home`;
    const moneylineHomeFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(moneylineHomeKey);

    if (!moneylineHomeFunction) {
        throw new Error(`Did not find function.`);
    }

    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        value: 'home',
        updateFunction: moneylineHomeFunction,
    })
}

export async function total({
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}) {
    const totalOverKey = `${statistic.name}_over`;
    const totalOverFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(totalOverKey);

    if (!totalOverFunction) {
        throw new Error(`Did not find function.`);
    }

    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Over,
        updateFunction: totalOverFunction,
    });

    const totalUnderKey = `${statistic.name}_under`;
    const totalUnderFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(totalUnderKey);

    if (!totalUnderFunction) {
        throw new Error(`Did not find function.`);
    }

    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Under,
        updateFunction: totalUnderFunction,
    });
}