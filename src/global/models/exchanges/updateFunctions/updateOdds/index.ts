import * as fanDuel from './fanDuel';
import * as draftKings from './draftKings';

export const updateOddFunctions = new Map<string, Function>([
    ['draftKings_spread_away', draftKings.spreadAway],
    ['draftKings_spread_home', draftKings.spreadHome],
    ['draftKings_moneyline', draftKings.moneyline],
    ['draftKings_total', draftKings.total],

    ['fanDuel_spread_away', fanDuel.spreadAway],
    ['fanDuel_spread_home', fanDuel.spreadHome],
    ['fanDuel_moneyline', fanDuel.moneyline],
    ['fanDuel_total', fanDuel.total],
]);