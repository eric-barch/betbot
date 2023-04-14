"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExchangeOdds = void 0;
// import { updateStatisticOddsFunctions } from '../../../exchanges';
async function updateExchangeOdds() {
    for (const statistic of this.statisticSet) {
        // const updateOddsFunction = updateStatisticOddsFunctions.get(`${this.nameCamelCase}_${statistic.name}`);
        // await updateOddsFunction();
    }
    return this.oddSet;
}
exports.updateExchangeOdds = updateExchangeOdds;
//# sourceMappingURL=draftKings.js.map