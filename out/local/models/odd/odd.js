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
exports.Odd = void 0;
const databaseModels = __importStar(require("../../../database"));
const globalModels = __importStar(require("../../../global"));
class Odd {
    // private constructor
    constructor({ exchange, statistic, updateOddElementsFunction, }) {
        this.wrappedPrice = null;
        this.wrappedValue = null;
        this.updateOddElementsFunction = updateOddElementsFunction.bind(this);
        this.exchange = exchange;
        this.statistic = statistic;
        this.wrappedPriceElement = null;
        this.wrappedValueElement = null;
        this.exchange.oddSet.add(this);
        this.statistic.oddSet.add(this);
        this.wrappedSqlOdd = null;
    }
    // public async constructor
    static async create({ exchange, statistic, updateOddElementsFunction, }) {
        const newOdd = new Odd({
            exchange: exchange,
            statistic: statistic,
            updateOddElementsFunction: updateOddElementsFunction,
        });
        await newOdd.initSqlOdd();
        globalModels.allOdds.add(newOdd);
        return newOdd;
    }
    // private sequelize instance constructor
    async initSqlOdd() {
        const exchange = this.exchange;
        const statistic = this.statistic;
        const exchangeId = exchange.sqlExchange.get('id');
        const statisticId = statistic.sqlStatistic.get('id');
        const value = this.getValue();
        await databaseModels.Odd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                statisticId: statisticId,
            },
            defaults: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                value: value,
            },
        }).then(async ([sqlOdd, created]) => {
            if (!created) {
                await sqlOdd.update({});
            }
            this.sqlOdd = sqlOdd;
        });
        return this.sqlOdd;
    }
    // public instance methods
    matches({ exchange, statistic, }) {
        const exchangeMatches = (this.exchange === exchange);
        const statisticMatches = (this.statistic === statistic);
        if (exchangeMatches && statisticMatches) {
            return true;
        }
        return false;
    }
    ;
    async updateElements() {
        await this.updateOddElementsFunction({
            exchange: this.exchange,
            statistic: this.statistic,
        });
    }
    async updateValues() {
        const priceElement = await this.getPriceElement();
        const valueElement = await this.getValueElement();
        if (!priceElement) {
            await this.setPrice(null);
        }
        else {
            const priceJson = await (await priceElement.getProperty('textContent')).jsonValue();
            if (!priceJson) {
                await this.setPrice(null);
            }
            else {
                const priceJsonClean = priceJson.replace(/[a-zA-Z\s]/g, '').replace(/−/g, '-');
                const price = Number(priceJsonClean);
                await this.setPrice(price);
            }
        }
        if (!valueElement) {
            await this.setValue(null);
            return;
        }
        const valueJson = await (await valueElement.getProperty('textContent')).jsonValue();
        if (!valueJson) {
            this.setValue(null);
            return;
        }
        const valueJsonClean = valueJson.replace(/[a-zA-Z\s]/g, '').replace(/−/g, '-');
        const value = Number(valueJsonClean);
        await this.setValue(value);
    }
    // getters and setters
    async getPriceElement() {
        if (!this.wrappedPriceElement) {
            await this.updateElements();
        }
        return this.wrappedPriceElement;
    }
    setPriceElement(priceElement) {
        this.wrappedPriceElement = priceElement;
    }
    async getValueElement() {
        if (!this.wrappedValueElement) {
            await this.updateElements();
        }
        return this.wrappedValueElement;
    }
    setValueElement(valueElement) {
        this.wrappedValueElement = valueElement;
    }
    getPrice() {
        return this.wrappedPrice;
    }
    async setPrice(price) {
        this.wrappedPrice = price;
        await this.sqlOdd.update({
            price: price,
        });
    }
    getValue() {
        return this.wrappedValue;
    }
    async setValue(value) {
        this.wrappedValue = value;
        await this.sqlOdd.update({
            value: value,
        });
    }
    get sqlOdd() {
        if (!this.wrappedSqlOdd) {
            throw new Error(`${this.exchange.name} ${this.statistic.name} sqlOdd is null.`);
        }
        return this.wrappedSqlOdd;
    }
    set sqlOdd(sqlOdd) {
        this.wrappedSqlOdd = sqlOdd;
    }
}
exports.Odd = Odd;
//# sourceMappingURL=odd.js.map