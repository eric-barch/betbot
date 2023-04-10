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
exports.total = exports.moneyline = exports.spreadHome = exports.spreadAway = exports.map = void 0;
const localModels = __importStar(require("../../../../../local"));
exports.map = new Map([
    ['spread_away', spreadAway],
    ['spread_home', spreadHome],
    ['moneyline', moneyline],
    ['total', total],
]);
async function spreadAway({ exchange, statistic, }) {
    const spreadAwayOverKey = `${statistic.name}_over`;
    const spreadAwayOverFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadAwayOverKey);
    if (!spreadAwayOverFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Over,
        updateFunction: spreadAwayOverFunction,
    });
    const spreadAwayUnderKey = `${statistic.name}_under`;
    const spreadAwayUnderFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadAwayUnderKey);
    if (!spreadAwayUnderFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Under,
        updateFunction: spreadAwayUnderFunction,
    });
}
exports.spreadAway = spreadAway;
async function spreadHome({ exchange, statistic, }) {
    const spreadHomeOverKey = `${statistic.name}_over`;
    const spreadHomeOverFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadHomeOverKey);
    if (!spreadHomeOverFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Over,
        updateFunction: spreadHomeOverFunction,
    });
    const spreadHomeUnderKey = `${statistic.name}_under`;
    const spreadHomeUnderFunction = localModels.updateFunctions.fanDuel.oddValue.map.get(spreadHomeUnderKey);
    if (!spreadHomeUnderFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Under,
        updateFunction: spreadHomeUnderFunction,
    });
}
exports.spreadHome = spreadHome;
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