import * as fanDuel from './fanDuel';
import * as draftKings from './draftKings';

export const updateStatisticsFunctions = new Map<string, Function> ([
    ['fanDuel', fanDuel.updateStatistics],
    ['draftKings', draftKings.updateStatistics],
]);