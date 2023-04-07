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
exports.Odd = exports.Inequality = void 0;
const databaseModels = __importStar(require("../../../database/models"));
const globalModels = __importStar(require("../../../global/models"));
var Inequality;
(function (Inequality) {
    Inequality[Inequality["GreaterThan"] = 0] = "GreaterThan";
    Inequality[Inequality["EqualTo"] = 1] = "EqualTo";
    Inequality[Inequality["LessThan"] = 2] = "LessThan";
})(Inequality = exports.Inequality || (exports.Inequality = {}));
class Odd {
    // private constructor
    constructor({ inequality, price, value, exchange, statistic, }) {
        this.inequality = inequality;
        this.price = price;
        this.value = value;
        this.exchange = exchange;
        this.statistic = statistic;
        this.exchange.oddSet.add(this);
        this.statistic.oddSet.add(this);
        this.wrappedElement = null;
        this.wrappedOpposite = null;
        this.wrappedSqlOdd = null;
    }
    // public async constructor
    static async create({ inequality, value, price, exchange, statistic, }) {
        const newOdd = new Odd({
            inequality: inequality,
            value: value,
            price: price,
            exchange: exchange,
            statistic: statistic,
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
        await databaseModels.Odd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                statisticId: statisticId,
            },
        }).then(async ([sqlOdd, created]) => {
            if (!created) {
                // Transfer current odd to PastOdds.
                await sqlOdd.update({});
            }
            this.sqlOdd = sqlOdd;
        });
        return this.sqlOdd;
    }
    // public instance methods
    matches() {
        return false;
    }
    // public static methods
    // getters and setters
    get element() {
        if (!this.wrappedElement) {
            throw new Error(`${this.exchange.name} ${this.statistic.name} element is null.`);
        }
        return this.wrappedElement;
    }
    set element(element) {
        this.wrappedElement = element;
    }
    get opposite() {
        if (!this.wrappedOpposite) {
            throw new Error(`${this.exchange.name} ${this.statistic.name} opposite is null.`);
        }
        return this.wrappedOpposite;
    }
    set opposite(opposite) {
        this.opposite = opposite;
        opposite.opposite = this;
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