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
exports.total = exports.moneyline = exports.spread = exports.map = void 0;
const localModels = __importStar(require("../../../../../local"));
exports.map = new Map([
    ['spread', spread],
    ['moneyline', moneyline],
    ['total', total],
]);
async function spread({ exchange, statistic, }) {
    const spreadOverKey = `${statistic.name}_over`;
    const spreadOverFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadOverKey);
    if (!spreadOverFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Over,
        updateFunction: spreadOverFunction,
    });
    const spreadUnderKey = `${statistic.name}_under`;
    const spreadUnderFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadUnderKey);
    if (!spreadUnderFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Under,
        updateFunction: spreadUnderFunction,
    });
}
exports.spread = spread;
async function moneyline({ exchange, statistic, }) {
    const moneylineAwayKey = `${statistic.name}_away`;
    const moneylineAwayFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(moneylineAwayKey);
    if (!moneylineAwayFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        value: 'away',
        updateFunction: moneylineAwayFunction,
    });
    const moneylineHomeKey = `${statistic.name}_home`;
    const moneylineHomeFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(moneylineHomeKey);
    if (!moneylineHomeFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        value: 'home',
        updateFunction: moneylineHomeFunction,
    });
}
exports.moneyline = moneyline;
async function total({ exchange, statistic, }) {
    const totalOverKey = `${statistic.name}_over`;
    const totalOverFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(totalOverKey);
    if (!totalOverFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Over,
        updateFunction: totalOverFunction,
    });
    const totalUnderKey = `${statistic.name}_under`;
    const totalUnderFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(totalUnderKey);
    if (!totalUnderFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Under,
        updateFunction: totalUnderFunction,
    });
}
exports.total = total;
//# sourceMappingURL=statisticOddSet.js.map