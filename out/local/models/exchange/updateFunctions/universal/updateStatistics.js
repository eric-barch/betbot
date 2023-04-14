"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spreadAway = exports.map = void 0;
const localModels = __importStar(require("../../../../../local"));
exports.map = new Map([
    ['spread_away', spreadAway],
    // ['spread_home', spreadHome],
    // ['moneyline', moneyline],
    // ['total', total],
]);
async function spreadAway({ exchange, statistic, }) {
    const key = `${statistic.name}_over`;
    const spreadAwayOverFunction = localModels.updateFunctions.get(`${exchange.nameCamelCase}`);
    if (!spreadAwayOverFunction) {
        throw new Error(`Did not find function.`);
    }
}
exports.spreadAway = spreadAway;
// await statistic.oddSet.findOrCreate({
//     exchange: exchange,
//     statistic: statistic,
//     inequality: localModels.Inequality.Over,
//     updateFunction: spreadAwayOverFunction,
// });
// const spreadAwayUnderKey = `${statistic.name}_under`;
// const spreadAwayUnderFunction = localModels.updateFunctions.fanDuel.updateValues.map.get(spreadAwayUnderKey);
// if (!spreadAwayUnderFunction) {
//     throw new Error(`Did not find function.`);
// }
// await statistic.oddSet.findOrCreate({
//     exchange: exchange,
//     statistic: statistic,
//     inequality: localModels.Inequality.Under,
//     updateFunction: spreadAwayUnderFunction,
// });
// }
// export async function spreadHome({
//     exchange,
//     statistic,
// }: {
//     exchange: localModels.Exchange,
//     statistic: localModels.Statistic,
// }) {
//     const spreadHomeOverKey = `${statistic.name}_over`;
//     const spreadHomeOverFunction = localModels.updateFunctions.fanDuel.updateValues.map.get(spreadHomeOverKey);
//     if (!spreadHomeOverFunction) {
//         throw new Error(`Did not find function.`);
//     }
//     await statistic.oddSet.findOrCreate({
//         exchange: exchange,
//         statistic: statistic,
//         inequality: localModels.Inequality.Over,
//         updateFunction: spreadHomeOverFunction,
//     });
//     const spreadHomeUnderKey = `${statistic.name}_under`;
//     const spreadHomeUnderFunction = localModels.updateFunctions.fanDuel.updateValues.map.get(spreadHomeUnderKey);
//     if (!spreadHomeUnderFunction) {
//         throw new Error(`Did not find function.`);
//     }
//     await statistic.oddSet.findOrCreate({
//         exchange: exchange,
//         statistic: statistic,
//         inequality: localModels.Inequality.Under,
//         updateFunction: spreadHomeUnderFunction,
//     });
// }
// export async function moneyline({
//     exchange,
//     statistic,
// }: {
//     exchange: localModels.Exchange,
//     statistic: localModels.Statistic,
// }) {
//     const moneylineAwayKey = `${statistic.name}_away`;
//     const moneylineAwayFunction = localModels.updateFunctions.fanDuel.updateValues.map.get(moneylineAwayKey);
//     if (!moneylineAwayFunction) {
//         throw new Error(`Did not find function.`);
//     }
//     await statistic.oddSet.findOrCreate({
//         exchange: exchange,
//         statistic: statistic,
//         value: 'away',
//         updateFunction: moneylineAwayFunction,
//     });
//     const moneylineHomeKey = `${statistic.name}_home`;
//     const moneylineHomeFunction = localModels.updateFunctions.fanDuel.updateValues.map.get(moneylineHomeKey);
//     if (!moneylineHomeFunction) {
//         throw new Error(`Did not find function.`);
//     }
//     await statistic.oddSet.findOrCreate({
//         exchange: exchange,
//         statistic: statistic,
//         value: 'home',
//         updateFunction: moneylineHomeFunction,
//     })
// }
// export async function total({
//     exchange,
//     statistic,
// }: {
//     exchange: localModels.Exchange,
//     statistic: localModels.Statistic,
// }) {
//     const totalOverKey = `${statistic.name}_over`;
//     const totalOverFunction = localModels.updateFunctions.fanDuel.updateValues.map.get(totalOverKey);
//     if (!totalOverFunction) {
//         throw new Error(`Did not find function.`);
//     }
//     await statistic.oddSet.findOrCreate({
//         exchange: exchange,
//         statistic: statistic,
//         inequality: localModels.Inequality.Over,
//         updateFunction: totalOverFunction,
//     });
//     const totalUnderKey = `${statistic.name}_under`;
//     const totalUnderFunction = localModels.updateFunctions.fanDuel.updateValues.map.get(totalUnderKey);
//     if (!totalUnderFunction) {
//         throw new Error(`Did not find function.`);
//     }
//     await statistic.oddSet.findOrCreate({
//         exchange: exchange,
//         statistic: statistic,
//         inequality: localModels.Inequality.Under,
//         updateFunction: totalUnderFunction,
//     });
// }
//# sourceMappingURL=updateStatistics.js.map