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
exports.total = exports.moneyline = exports.spreadHome = exports.spreadAway = void 0;
const localModels = __importStar(require("../../../../../local"));
const draftKings_1 = require("../updateOddElements/draftKings");
async function spreadAway({ exchange, statistic, }) {
    const updateOverOddElementsFunction = draftKings_1.updateOddElementsFunctions.get(`spread_away_over`);
    if (!updateOverOddElementsFunction) {
        throw new Error(`Did not find function`);
    }
    const overOddExists = await updateOverOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });
    if (overOddExists) {
        const overOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Over,
            updateOddElementsFunction: updateOverOddElementsFunction,
        });
        exchange.oddSet.add(overOdd);
        statistic.oddSet.add(overOdd);
    }
    const updateUnderOddElementsFunction = draftKings_1.updateOddElementsFunctions.get(`spread_away_under`);
    if (!updateUnderOddElementsFunction) {
        throw new Error(`Did not find function`);
    }
    const underOddExists = await updateUnderOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });
    if (underOddExists) {
        const underOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Under,
            updateOddElementsFunction: updateUnderOddElementsFunction,
        });
        exchange.oddSet.add(underOdd);
        statistic.oddSet.add(underOdd);
    }
    return exchange.oddSet;
}
exports.spreadAway = spreadAway;
async function spreadHome({ exchange, statistic, }) {
    const updateOverOddElementsFunction = draftKings_1.updateOddElementsFunctions.get(`spread_home_over`);
    if (!updateOverOddElementsFunction) {
        throw new Error(`Did not find function`);
    }
    const overOddExists = await updateOverOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });
    if (overOddExists) {
        const overOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Over,
            updateOddElementsFunction: updateOverOddElementsFunction,
        });
        exchange.oddSet.add(overOdd);
        statistic.oddSet.add(overOdd);
    }
    const updateUnderOddElementsFunction = draftKings_1.updateOddElementsFunctions.get(`spread_home_under`);
    if (!updateUnderOddElementsFunction) {
        throw new Error(`Did not find function`);
    }
    const underOddExists = await updateUnderOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });
    if (underOddExists) {
        const underOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Under,
            updateOddElementsFunction: updateUnderOddElementsFunction,
        });
        exchange.oddSet.add(underOdd);
        statistic.oddSet.add(underOdd);
    }
    return exchange.oddSet;
}
exports.spreadHome = spreadHome;
async function moneyline({ exchange, statistic, }) {
    const updateAwayOddElementsFunction = draftKings_1.updateOddElementsFunctions.get(`moneyline_away`);
    if (!updateAwayOddElementsFunction) {
        throw new Error(`Did not find function`);
    }
    const awayOddExists = await updateAwayOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });
    if (awayOddExists) {
        const awayOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            value: 'away',
            updateOddElementsFunction: updateAwayOddElementsFunction,
        });
        exchange.oddSet.add(awayOdd);
        statistic.oddSet.add(awayOdd);
    }
    const updateHomeOddElementsFunction = draftKings_1.updateOddElementsFunctions.get(`moneyline_home`);
    if (!updateHomeOddElementsFunction) {
        throw new Error(`Did not find function`);
    }
    const homeOddExists = await updateHomeOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });
    if (homeOddExists) {
        const homeOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            value: 'home',
            updateOddElementsFunction: updateHomeOddElementsFunction,
        });
        exchange.oddSet.add(homeOdd);
        statistic.oddSet.add(homeOdd);
    }
    return exchange.oddSet;
}
exports.moneyline = moneyline;
async function total({ exchange, statistic, }) {
    const updateOverOddElementsFunction = draftKings_1.updateOddElementsFunctions.get(`total_over`);
    if (!updateOverOddElementsFunction) {
        throw new Error(`Did not find function`);
    }
    const overOddExists = await updateOverOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });
    if (overOddExists) {
        const overOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Over,
            updateOddElementsFunction: updateOverOddElementsFunction,
        });
        exchange.oddSet.add(overOdd);
        statistic.oddSet.add(overOdd);
    }
    const updateUnderOddElementsFunction = draftKings_1.updateOddElementsFunctions.get(`total_under`);
    if (!updateUnderOddElementsFunction) {
        throw new Error(`Did not find function`);
    }
    const underOddExists = await updateUnderOddElementsFunction({
        exchange: exchange,
        statistic: statistic,
    });
    if (underOddExists) {
        const underOdd = await exchange.oddSet.findOrCreate({
            exchange: exchange,
            statistic: statistic,
            inequality: localModels.Inequality.Under,
            updateOddElementsFunction: updateUnderOddElementsFunction,
        });
        exchange.oddSet.add(underOdd);
        statistic.oddSet.add(underOdd);
    }
    return exchange.oddSet;
}
exports.total = total;
//# sourceMappingURL=draftKings.js.map