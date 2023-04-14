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
exports.updateStatisticOddsFunctionsMap = void 0;
const globalModels = __importStar(require("../../../../global"));
const localModels = __importStar(require("../../../../local"));
const updateOddElements_1 = require("./updateOddElements");
exports.updateStatisticOddsFunctionsMap = new Map([
    ['spread_away', spreadAway],
    ['spread_home', spreadHome],
    ['moneyline', moneyline],
    ['total', total],
]);
async function spreadAway() {
    for (const exchange of globalModels.allExchanges) {
        const updateOverOddElementsFunction = updateOddElements_1.updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_spread_away_over`);
        if (!updateOverOddElementsFunction) {
            throw new Error(`Did not find function`);
        }
        const overOddExists = await updateOverOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });
        if (overOddExists) {
            const overOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Over,
                updateOddElementsFunction: updateOverOddElementsFunction,
            });
            this.oddSet.add(overOdd);
        }
        const updateUnderOddElementsFunction = updateOddElements_1.updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_spread_away_under`);
        if (!updateUnderOddElementsFunction) {
            throw new Error(`Did not find function`);
        }
        const underOddExists = await updateUnderOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });
        if (underOddExists) {
            const underOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Under,
                updateOddElementsFunction: updateUnderOddElementsFunction,
            });
            this.oddSet.add(underOdd);
        }
    }
    return this.oddSet;
}
async function spreadHome() {
    for (const exchange of globalModels.allExchanges) {
        const updateOverOddElementsFunction = updateOddElements_1.updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_spread_home_over`);
        if (!updateOverOddElementsFunction) {
            throw new Error(`Did not find function`);
        }
        const overOddExists = await updateOverOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });
        if (overOddExists) {
            const overOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Over,
                updateOddElementsFunction: updateOverOddElementsFunction,
            });
            this.oddSet.add(overOdd);
        }
        const updateUnderOddElementsFunction = updateOddElements_1.updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_spread_home_under`);
        if (!updateUnderOddElementsFunction) {
            throw new Error(`Did not find function`);
        }
        const underOddExists = await updateUnderOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });
        if (underOddExists) {
            const underOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Under,
                updateOddElementsFunction: updateUnderOddElementsFunction,
            });
            this.oddSet.add(underOdd);
        }
    }
    return this.oddSet;
}
async function moneyline() {
    for (const exchange of globalModels.allExchanges) {
        const updateAwayOddElementsFunction = updateOddElements_1.updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_moneyline_away`);
        if (!updateAwayOddElementsFunction) {
            throw new Error(`Did not find function`);
        }
        const awayOddExists = await updateAwayOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });
        if (awayOddExists) {
            const awayOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                value: 'away',
                updateOddElementsFunction: updateAwayOddElementsFunction,
            });
            this.oddSet.add(awayOdd);
        }
        const updateHomeOddElementsFunction = updateOddElements_1.updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_moneyline_home`);
        if (!updateHomeOddElementsFunction) {
            throw new Error(`Did not find function`);
        }
        const homeOddExists = await updateHomeOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });
        if (homeOddExists) {
            const homeOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                value: 'home',
                updateOddElementsFunction: updateHomeOddElementsFunction,
            });
            this.oddSet.add(homeOdd);
        }
    }
    return this.oddSet;
}
async function total() {
    for (const exchange of globalModels.allExchanges) {
        const updateOverOddElementsFunction = updateOddElements_1.updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_total_over`);
        if (!updateOverOddElementsFunction) {
            throw new Error(`Did not find function`);
        }
        const overOddExists = await updateOverOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });
        if (overOddExists) {
            const overOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Over,
                updateOddElementsFunction: updateOverOddElementsFunction,
            });
            this.oddSet.add(overOdd);
        }
        const updateUnderOddElementsFunction = updateOddElements_1.updateOddElementsFunctionsMap.get(`${exchange.nameCamelCase}_total_under`);
        if (!updateUnderOddElementsFunction) {
            throw new Error(`Did not find function`);
        }
        const underOddExists = await updateUnderOddElementsFunction({
            exchange: exchange,
            statistic: this,
        });
        if (underOddExists) {
            const underOdd = await this.oddSet.findOrCreate({
                exchange: exchange,
                statistic: this,
                inequality: localModels.Inequality.Under,
                updateOddElementsFunction: updateUnderOddElementsFunction,
            });
            this.oddSet.add(underOdd);
        }
    }
    return this.oddSet;
}
//# sourceMappingURL=updateStatisticOdds.js.map