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
exports.ContinuousOdd = exports.Inequality = void 0;
const databaseModels = __importStar(require("../../../../database"));
const globalModels = __importStar(require("../../../../global"));
const odd_1 = require("../odd");
var Inequality;
(function (Inequality) {
    Inequality["Over"] = "over";
    Inequality["Equal"] = "equal";
    Inequality["Under"] = "under";
})(Inequality = exports.Inequality || (exports.Inequality = {}));
class ContinuousOdd extends odd_1.Odd {
    // private constructor
    constructor({ exchange, statistic, inequality, updateFunction, }) {
        super({
            exchange: exchange,
            statistic: statistic,
            updateFunction: updateFunction,
        });
        this.inequality = inequality;
        this.wrappedValue = null;
        this.wrappedSqlContinuousOdd = null;
    }
    // public async constructor
    static async create({ exchange, statistic, inequality, updateFunction, }) {
        const newContinuousOdd = new ContinuousOdd({
            exchange: exchange,
            statistic: statistic,
            inequality: inequality,
            updateFunction: updateFunction,
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
        await databaseModels.ContinuousOdd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                inequality: this.inequality.toString(),
            },
        }).then(async ([sqlContinuousOdd, created]) => {
            if (!created) {
                await sqlContinuousOdd.update({});
            }
            this.sqlContinuousOdd = sqlContinuousOdd;
        });
        return this.sqlContinuousOdd;
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
    get price() {
        return this.wrappedPrice;
    }
    async setPrice(price) {
        this.wrappedPrice = price;
        await this.sqlContinuousOdd.update({
            price: price,
        });
    }
    get value() {
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