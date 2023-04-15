import * as draftKings from './draftKings';
import * as fanDuel from './fanDuel';

export const updateElementsFunctions = new Map<string, Function> ([
    ['fanDuel_spread_away', fanDuel.spreadAway],
    ['fanDuel_spread_home', fanDuel.spreadHome],
    ['fanDuel_moneyline_away', fanDuel.moneylineAway],
    ['fanDuel_moneyline_home', fanDuel.moneylineHome],
    ['fanDuel_total_over', fanDuel.totalOver],
    ['fanDuel_total_under', fanDuel.totalUnder],

    ['draftKings_spread_away', draftKings.spreadAway],
    ['draftKings_spread_home', draftKings.spreadHome],
    ['draftKings_moneyline_away', draftKings.moneylineAway],
    ['draftKings_moneyline_home', draftKings.moneylineHome],
    ['draftKings_total_over', draftKings.totalOver],
    ['draftKings_total_under', draftKings.totalUnder],
]);