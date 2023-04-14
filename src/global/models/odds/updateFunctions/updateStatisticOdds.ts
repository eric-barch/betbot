import * as globalModels from '../../../../global';
import * as localModels from '../../../../local';

import { updateOddElementsFunctionsMap } from './updateOddElements';

export const updateStatisticOddsFunctionsMap = new Map<string, Function>([
    ['spread_away', spreadAway],
    ['spread_home', spreadHome],
    ['moneyline', moneyline],
    ['total', total],
]);

async function spreadAway(this: localModels.Statistic): Promise<localModels.OddSet> {
    for (const exchange of globalModels.allExchanges) {
        const updateOverOddElementsFunction = updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_spread_away_over`);

        if (!updateOverOddElementsFunction) {
            throw new Error(`Did not find function`);
        }

        const overOddExists = await updateOverOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });

        if (overOddExists) {
            const overOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Over,
                updateOddElementsFunction: updateOverOddElementsFunction,
            });
            this.oddSet.add(overOdd);
        }

        const updateUnderOddElementsFunction = updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_spread_away_under`);
        
        if (!updateUnderOddElementsFunction) {
            throw new Error(`Did not find function`);
        }

        const underOddExists = await updateUnderOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });

        if (underOddExists) {
            const underOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Under,
                updateOddElementsFunction: updateUnderOddElementsFunction,
            });
            this.oddSet.add(underOdd);
        }
    }

    return this.oddSet;
}

async function spreadHome(this: localModels.Statistic): Promise<localModels.OddSet> {
    for (const exchange of globalModels.allExchanges) {
        const updateOverOddElementsFunction = updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_spread_home_over`);

        if (!updateOverOddElementsFunction) {
            throw new Error(`Did not find function`);
        }

        const overOddExists = await updateOverOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });

        if (overOddExists) {
            const overOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Over,
                updateOddElementsFunction: updateOverOddElementsFunction,
            });
            this.oddSet.add(overOdd);
        }

        const updateUnderOddElementsFunction = updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_spread_home_under`);

        if (!updateUnderOddElementsFunction) {
            throw new Error(`Did not find function`);
        }

        const underOddExists = await updateUnderOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });

        if (underOddExists) {
            const underOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Under,
                updateOddElementsFunction: updateUnderOddElementsFunction,
            });
            this.oddSet.add(underOdd);
        }
    }

    return this.oddSet;
}

async function moneyline(this: localModels.Statistic): Promise<localModels.OddSet> {
    for (const exchange of globalModels.allExchanges) {
        const updateAwayOddElementsFunction = updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_moneyline_away`);

        if (!updateAwayOddElementsFunction) {
            throw new Error(`Did not find function`);
        }

        const awayOddExists = await updateAwayOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });

        if (awayOddExists) {
            const awayOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                value: 'away',
                updateOddElementsFunction: updateAwayOddElementsFunction,
            });
            this.oddSet.add(awayOdd);
        }

        const updateHomeOddElementsFunction = updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_moneyline_home`);

        if (!updateHomeOddElementsFunction) {
            throw new Error(`Did not find function`);
        }

        const homeOddExists = await updateHomeOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });

        if (homeOddExists) {
            const homeOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                value: 'home',
                updateOddElementsFunction: updateHomeOddElementsFunction,
            });
            this.oddSet.add(homeOdd);
        }
    }

    return this.oddSet;
}

async function total(this: localModels.Statistic): Promise<localModels.OddSet> {
    for (const exchange of globalModels.allExchanges) {
        const updateOverOddElementsFunction = updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_total_over`);

        if (!updateOverOddElementsFunction) {
            throw new Error(`Did not find function`);
        }

        const overOddExists = await updateOverOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });

        if (overOddExists) {
            const overOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Over,
                updateOddElementsFunction: updateOverOddElementsFunction,
            });
            this.oddSet.add(overOdd);
        }

        const updateUnderOddElementsFunction = updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_total_under`);

        if (!updateUnderOddElementsFunction) {
            throw new Error(`Did not find function`);
        }

        const underOddExists = await updateUnderOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });

        if (underOddExists) {
            const underOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Under,
                updateOddElementsFunction: updateUnderOddElementsFunction,
            });
            this.oddSet.add(underOdd);
        }
    }

    return this.oddSet;
}