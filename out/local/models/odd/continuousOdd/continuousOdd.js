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
exports.ContinuousOdd = void 0;
const databaseModels = __importStar(require("../../../../database"));
const globalModels = __importStar(require("../../../../global"));
const odd_1 = require("../odd");
class ContinuousOdd extends odd_1.Odd {
    // private constructor
    constructor({ exchange, statistic, inequality, updateElementsFunction, }) {
        super({
            exchange: exchange,
            statistic: statistic,
            inequality: inequality,
            updateElementsFunction: updateElementsFunction,
        });
        this.wrappedValue = null;
        this.wrappedSqlContinuousOdd = null;
    }
    // public async constructor
    static async create({ exchange, statistic, inequality, updateElementsFunction, }) {
        const newContinuousOdd = new ContinuousOdd({
            exchange: exchange,
            statistic: statistic,
            inequality: inequality,
            updateElementsFunction: updateElementsFunction,
        });
        await newContinuousOdd.initSqlContinuousOdd();
        globalModels.allOdds.add(newContinuousOdd);
        return newContinuousOdd;
    }
    // private sequelize instance constructor
    async initSqlContinuousOdd() {
        const exchange = this.exchange;
        const statistic = this.statistic;
        const exchangeId = exchange.sqlExchange.get('id');
        const statisticId = statistic.sqlStatistic.get('id');
        const inequality = this.getInequality();
        const value = this.getValue();
        await databaseModels.ContinuousOdd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                inequality: inequality,
            },
            defaults: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                inequality: inequality,
                value: value,
            },
        }).then(async ([sqlContinuousOdd, created]) => {
            if (!created) {
                await sqlContinuousOdd.update({});
            }
            this.sqlContinuousOdd = sqlContinuousOdd;
        });
        return this.sqlContinuousOdd;
    }
    // public instance methods
    matches({ exchange, statistic, inequality, }) {
        const exchangeMatches = (this.exchange === exchange);
        const statisticMatches = (this.statistic === statistic);
        const inequalityMatches = (this.wrappedInequality === inequality);
        if (exchangeMatches && statisticMatches && inequalityMatches) {
            return true;
        }
        return false;
    }
    // this function is slow
    async updateValues() {
        const start = new Date();
        const priceElement = await this.getPriceElement();
        const valueElement = await this.getValueElement();
        if (!priceElement) {
            await this.setPrice(null);
            const priceEnd = new Date();
            const priceDuration = (priceEnd.getTime() - start.getTime());
            console.log(`priceDuration: ${priceDuration}`);
        }
        else {
            const priceJson = await (await priceElement.getProperty('textContent')).jsonValue();
            if (!priceJson) {
                await this.setPrice(null);
                const priceEnd = new Date();
                const priceDuration = (priceEnd.getTime() - start.getTime());
                console.log(`priceDuration: ${priceDuration}`);
                return;
            }
            const price = Number(priceJson.replace(/[^0-9+\-.]/g, ''));
            await this.setPrice(price);
            const priceEnd = new Date();
            const priceDuration = (priceEnd.getTime() - start.getTime());
            console.log(`priceDuration: ${priceDuration}`);
        }
        if (!valueElement) {
            this.setValue(null);
            return;
        }
        else {
            const valueJson = await (await valueElement.getProperty('textContent')).jsonValue();
            if (!valueJson) {
                this.setValue(null);
                return;
            }
            const value = Number(valueJson.replace(/[^0-9+\-.]/g, ''));
            this.setValue(value);
        }
    }
    // getters and setters
    get sqlContinuousOdd() {
        if (!this.wrappedSqlContinuousOdd) {
            throw new Error(`${this.exchange.name} ${this.statistic.name} sqlContinuousOdd is null.`);
        }
        return this.wrappedSqlContinuousOdd;
    }
    set sqlContinuousOdd(sqlContinuousOdd) {
        this.wrappedSqlContinuousOdd = sqlContinuousOdd;
    }
    async setInequality(inequality) {
        this.wrappedInequality = inequality;
        await this.sqlContinuousOdd.update({
            inequality: inequality,
        });
    }
    async setPrice(price) {
        this.wrappedPrice = price;
        await this.sqlContinuousOdd.update({
            price: price,
        });
    }
    getValue() {
        return this.wrappedValue;
    }
    async setValue(value) {
        this.wrappedValue = value;
        await this.sqlContinuousOdd.update({
            value: value,
        });
    }
}
exports.ContinuousOdd = ContinuousOdd;
//# sourceMappingURL=continuousOdd.js.map