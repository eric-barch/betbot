import * as localModels from '../../../../../local';

export const map = new Map<string, Function>([
    ['spread', spread],
    ['moneyline', moneyline],
    ['total', total],
]);

export async function spread({
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}) {
    const spreadOverKey = `${statistic.name}_over`;
    const spreadOverFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadOverKey);

    if (!spreadOverFunction) {
        throw new Error(`Did not find function.`);
    }

    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Over,
        updateFunction: spreadOverFunction,
    });

    const spreadUnderKey = `${statistic.name}_under`;
    const spreadUnderFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadUnderKey);

    if (!spreadUnderFunction) {
        throw new Error(`Did not find function.`);
    }

    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Under,
        updateFunction: spreadUnderFunction,
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