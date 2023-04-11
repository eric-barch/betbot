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
exports.total = exports.moneyline = exports.spreadHome = exports.spreadAway = exports.updateFunctionsMap = void 0;
const localModels = __importStar(require("../../../../local"));
exports.updateFunctionsMap = new Map([
    ['spread_away', spreadAway],
    ['spread_home', spreadHome],
    ['moneyline', moneyline],
    ['total', total],
]);
async function spreadAway({ exchange, statistic, }) {
    const exchangeUpdateFunctionsMap = exchange.updateFunctionsMap;
    const overKey = `${statistic.name}_over`;
    const overUpdateElementFunction = exchangeUpdateFunctionsMap.get(overKey);
    if (!overUpdateElementFunction) {
        throw new Error(`Did not find spreadAwayOver element function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Over,
        updateElementsFunction: overUpdateElementFunction,
    });
    const underKey = `${statistic.name}_under`;
    const underUpdateElementFunction = exchangeUpdateFunctionsMap.get(underKey);
    if (!underUpdateElementFunction) {
        throw new Error(`Did not find spreadAwayUnder function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Under,
        updateElementsFunction: underUpdateElementFunction,
    });
}
exports.spreadAway = spreadAway;
async function spreadHome({ exchange, statistic, }) {
    const exchangeUpdateFunctionsMap = exchange.updateFunctionsMap;
    const overKey = `${statistic.name}_over`;
    const overUpdateElementFunction = exchangeUpdateFunctionsMap.get(overKey);
    if (!overUpdateElementFunction) {
        throw new Error(`Did not find spreadHomeOver element function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Over,
        updateElementsFunction: overUpdateElementFunction,
    });
    const underKey = `${statistic.name}_under`;
    const underUpdateElementFunction = exchangeUpdateFunctionsMap.get(underKey);
    if (!underUpdateElementFunction) {
        throw new Error(`Did not find spreadHomeUnder function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Under,
        updateElementsFunction: underUpdateElementFunction,
    });
}
exports.spreadHome = spreadHome;
async function moneyline({ exchange, statistic, }) {
    const exchangeUpdateFunctionsMap = exchange.updateFunctionsMap;
    const awayKey = `${statistic.name}_away`;
    const awayUpdateElementFunction = exchangeUpdateFunctionsMap.get(awayKey);
    if (!awayUpdateElementFunction) {
        throw new Error(`Did not find function.`);
    }
    // problem here
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        value: 'away',
        updateElementsFunction: awayUpdateElementFunction,
    });
    const homeKey = `${statistic.name}_home`;
    const homeUpdateElementFunction = exchangeUpdateFunctionsMap.get(homeKey);
    if (!homeUpdateElementFunction) {
        throw new Error(`Did not find function.`);
    }
    // problem here
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        value: 'home',
        updateElementsFunction: homeUpdateElementFunction,
    });
}
exports.moneyline = moneyline;
async function total({ exchange, statistic, }) {
    const exchangeUpdateFunctionsMap = exchange.updateFunctionsMap;
    const overKey = `${statistic.name}_over`;
    const overUpdateElementFunction = exchangeUpdateFunctionsMap.get(overKey);
    if (!overUpdateElementFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Over,
        updateElementsFunction: overUpdateElementFunction,
    });
    const underKey = `${statistic.name}_under`;
    const underUpdateElementFunction = exchangeUpdateFunctionsMap.get(underKey);
    if (!underUpdateElementFunction) {
        throw new Error(`Did not find function.`);
    }
    await statistic.oddSet.findOrCreate({
        exchange: exchange,
        statistic: statistic,
        inequality: localModels.Inequality.Under,
        updateElementsFunction: underUpdateElementFunction,
    });
}
exports.total = total;
//# sourceMappingURL=updateFunctionsMap.js.map