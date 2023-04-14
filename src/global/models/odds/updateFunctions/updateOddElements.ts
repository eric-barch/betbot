import * as draftKings from './draftKings';
import * as fanDuel from './fanDuel';

export const updateOddElementsFunctionsMap = new Map<string, Function>([
    ['draftKings_spread_away_over', draftKings.spreadAwayOver],
    ['draftKings_spread_away_under', draftKings.spreadAwayUnder],
    ['draftKings_spread_home_over', draftKings.spreadHomeOver],
    ['draftKings_spread_home_under', draftKings.spreadHomeUnder],
    ['draftKings_moneyline_away', draftKings.moneylineAway],
    ['draftKings_moneyline_home', draftKings.moneylineHome],
    ['draftKings_total_over', draftKings.totalOver],
    ['draftKings_total_under', draftKings.totalUnder],

    ['fanDuel_spread_away_over', fanDuel.spreadAwayOver],
    ['fanDuel_spread_away_under', fanDuel.spreadAwayUnder],
    ['fanDuel_spread_home_over', fanDuel.spreadHomeOver],
    ['fanDuel_spread_home_under', fanDuel.spreadHomeUnder],
    ['fanDuel_moneyline_away', fanDuel.moneylineAway],
    ['fanDuel_moneyline_home', fanDuel.moneylineHome],
    ['fanDuel_total_over', fanDuel.totalOver],
    ['fanDuel_total_under', fanDuel.totalUnder],
]);