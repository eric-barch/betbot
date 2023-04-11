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
exports.DiscreteOdd = void 0;
const databaseModels = __importStar(require("../../../../database"));
const globalModels = __importStar(require("../../../../global"));
const odd_1 = require("../odd");
class DiscreteOdd extends odd_1.Odd {
    // private constructor
    constructor({ exchange, statistic, value, updateElementsFunction, }) {
        super({
            exchange: exchange,
            statistic: statistic,
            inequality: odd_1.Inequality.Equal,
            updateElementsFunction: updateElementsFunction,
        });
        this.wrappedValue = value;
        this.wrappedSqlDiscreteOdd = null;
    }
    // public async constructor
    static async create({ exchange, statistic, value, updateElementsFunction, }) {
        const newDiscreteOdd = new DiscreteOdd({
            exchange: exchange,
            statistic: statistic,
            value: value,
            updateElementsFunction: updateElementsFunction,
        });
        await newDiscreteOdd.initSqlDiscreteOdd();
        globalModels.allOdds.add(newDiscreteOdd);
        return newDiscreteOdd;
    }
    // private sequelize instance constructor
    async initSqlDiscreteOdd() {
        const exchange = this.exchange;
        const statistic = this.statistic;
        const exchangeId = exchange.sqlExchange.get('id');
        const statisticId = statistic.sqlStatistic.get('id');
        await databaseModels.DiscreteOdd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                value: await this.getValue(),
            },
            defaults: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                inequality: odd_1.Inequality.Equal,
                value: await this.getValue(),
            }
        }).then(async ([sqlDiscreteOdd, created]) => {
            if (!created) {
                await sqlDiscreteOdd.update({});
            }
            this.sqlDiscreteOdd = sqlDiscreteOdd;
        });
        return this.sqlDiscreteOdd;
    }
    // getters and setters
    get sqlDiscreteOdd() {
        if (!this.wrappedSqlDiscreteOdd) {
            throw new Error(`${this.exchange.name} ${this.statistic.name} sqlDiscreteOdd is null.`);
        }
        return this.wrappedSqlDiscreteOdd;
    }
    set sqlDiscreteOdd(sqlDiscreteOdd) {
        this.wrappedSqlDiscreteOdd = sqlDiscreteOdd;
    }
    async getInequality() {
        const inequality = this.inequality;
        return inequality;
    }
    async setInequality(inequality) {
        this.inequality = inequality;
        await this.sqlDiscreteOdd.update({
            inequality: inequality,
        });
    }
    async getPrice() {
        const price = this.price;
        return price;
    }
    async setPrice(price) {
        this.price = price;
        await this.sqlDiscreteOdd.update({
            price: price,
        });
    }
    async getValue() {
        const value = this.wrappedValue;
        return value;
    }
    async setValue(value) {
        this.wrappedValue = value;
        await this.sqlDiscreteOdd.update({
            value: value,
        });
    }
    async getPriceElement() {
        const element = await this.getWrappedPriceElement();
        return element;
    }
    async setPriceElement(element) {
        this.setWrappedPriceElement(element);
    }
    async getValueElement() {
        const element = await this.getWrappedValueElement();
        return element;
    }
    async setValueElement(element) {
        this.setWrappedValueElement(element);
    }
}
exports.DiscreteOdd = DiscreteOdd;
//# sourceMappingURL=discreteOdd.js.map