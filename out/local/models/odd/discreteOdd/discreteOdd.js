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
    constructor({ exchange, statistic, value, updateFunction, }) {
        super({
            exchange: exchange,
            statistic: statistic,
            updateFunction: updateFunction,
        });
        this.value = value;
        this.wrappedSqlDiscreteOdd = null;
    }
    // public async constructor
    static async create({ exchange, statistic, value, updateFunction, }) {
        const newDiscreteOdd = new DiscreteOdd({
            exchange: exchange,
            statistic: statistic,
            value: value,
            updateFunction: updateFunction,
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
                value: this.value,
            }
        }).then(async ([sqlDiscreteOdd, created]) => {
            if (!created) {
                await sqlDiscreteOdd.update({});
            }
            this.sqlDiscreteOdd = sqlDiscreteOdd;
        });
        return this.sqlDiscreteOdd;
    }
    get sqlDiscreteOdd() {
        if (!this.wrappedSqlDiscreteOdd) {
            throw new Error(`${this.exchange.name} ${this.statistic.name} sqlDiscreteOdd is null.`);
        }
        return this.wrappedSqlDiscreteOdd;
    }
    set sqlDiscreteOdd(sqlDiscreteOdd) {
        this.wrappedSqlDiscreteOdd = sqlDiscreteOdd;
    }
    get price() {
        return this.wrappedPrice;
    }
    async setPrice(price) {
        this.wrappedPrice = price;
        await this.sqlDiscreteOdd.update({
            price: price,
        });
    }
}
exports.DiscreteOdd = DiscreteOdd;
//# sourceMappingURL=discreteOdd.js.map