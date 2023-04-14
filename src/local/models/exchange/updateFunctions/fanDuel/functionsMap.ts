import * as updateGames from './updateGames';
import * as updateElements from './updateElements';

export const fanDuelFunctionsMap = new Map<string, Function>([
    ['games', updateGames.games],
    ['spread_away_over', updateElements.spreadAwayOver],
    ['spread_away_under', updateElements.spreadAwayUnder],
    ['spread_home_over', updateElements.spreadHomeOver],
    ['spread_home_under', updateElements.spreadHomeUnder],
    ['moneyline_away', updateElements.moneylineAway],
    ['moneyline_home', updateElements.moneylineHome],
    ['total_over', updateElements.totalOver],
    ['total_under', updateElements.totalUnder],
]);