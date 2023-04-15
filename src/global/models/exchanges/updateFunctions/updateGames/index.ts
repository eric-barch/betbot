import * as fanDuel from './fanDuel';
import * as draftKings from './draftKings';

export const updateGamesFunctions = new Map<string, Function> ([
    ['fanDuel', fanDuel.updateGames],
    ['draftKings', draftKings.updateGames],
]);