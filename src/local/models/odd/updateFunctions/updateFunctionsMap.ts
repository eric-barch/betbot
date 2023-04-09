import * as fanDuel from './fanDuel';

export const updateFunctionsMap = new Map<string, {
    updatePriceElementFunction: Function,
    updateValueElementFunction: Function,
}>([
    ['fanDuel_spread_test', {
        updatePriceElementFunction: fanDuel.spreadTest,
        updateValueElementFunction: fanDuel.spreadTest,
    }],
    ['fanDuel_spread_over', {
        updatePriceElementFunction: fanDuel.awaySpreadPrice,
        updateValueElementFunction: fanDuel.awaySpread,
    }],
    ['fanDuel_spread_under', {
        updatePriceElementFunction: fanDuel.homeSpreadPrice,
        updateValueElementFunction: fanDuel.homeSpread,
    }],
    ['fanDuel_money_equal_away', {
        updatePriceElementFunction: fanDuel.awayMoneyPrice,
        updateValueElementFunction: fanDuel.awayMoney,
    }],
    ['fanDuel_money_equal_home', {
        updatePriceElementFunction: fanDuel.homeMoneyPrice,
        updateValueElementFunction: fanDuel.homeMoney,
    }],
    ['fanDuel_total_over', {
        updatePriceElementFunction: fanDuel.overTotalPrice,
        updateValueElementFunction: fanDuel.overTotal,
    }],
    ['fanDuel_total_under', {
        updatePriceElementFunction: fanDuel.underTotalPrice,
        updateValueElementFunction: fanDuel.underTotal,
    }]
]);