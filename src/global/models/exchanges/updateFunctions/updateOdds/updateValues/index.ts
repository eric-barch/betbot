import * as draftKings from './draftKings';
import * as fanDuel from './fanDuel';

export const updateValuesFunctions = new Map<string, Function> ([
    ['draftKings', draftKings.updateValues],
    ['fanDuel', fanDuel.updateValues],
]);