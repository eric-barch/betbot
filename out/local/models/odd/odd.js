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
exports.TotalOdd = exports.MoneyOdd = exports.SpreadOdd = exports.Odd = void 0;
const databaseModels = __importStar(require("../../../database/models"));
const elementWrappers = __importStar(require("./elementWrappers"));
const globalModels = __importStar(require("../../../global/models"));
const fanDuel = __importStar(require("./updateElementFunctions/fanDuel"));
class Odd extends elementWrappers.ElementWrapper {
    constructor({ exchange, game, }) {
        super({
            exchange: exchange,
            game: game,
            updateElementFunction: fanDuel.odd,
        });
        this.exchange.oddSet.add(this);
        this.game.oddSet.add(this);
        this.spreadOdd = new SpreadOdd({
            exchange: exchange,
            game: game,
            parent: this,
        });
        this.moneyOdd = new MoneyOdd({
            exchange: exchange,
            game: game,
            parent: this,
        });
        this.totalOdd = new TotalOdd({
            exchange: exchange,
            game: game,
            parent: this,
        });
        this.wrappedSqlOdd = null;
    }
    // async construction methods
    static async create({ exchange, game, }) {
        const newOdd = new Odd({
            exchange: exchange,
            game: game,
        });
        await newOdd.init(); // Breaking here.
        globalModels.allOdds.add(newOdd);
        return newOdd;
    }
    async init() {
        const exchange = this.exchange;
        const game = this.game;
        const exchangeId = exchange.sqlExchange.get('id');
        const gameId = game.sqlGame.get('id');
        const spreadOdd = this.spreadOdd;
        const moneyOdd = this.moneyOdd;
        const totalOdd = this.totalOdd;
        await databaseModels.Odd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                gameId: gameId,
            },
            defaults: {
                spreadAwaySpread: spreadOdd.awaySpread.value,
                spreadHomeSpread: spreadOdd.homeSpread.value,
                spreadAwayPrice: spreadOdd.awayPrice.value,
                spreadHomePrice: spreadOdd.homePrice.value,
                moneyAwayPrice: moneyOdd.awayPrice.value,
                moneyHomePrice: moneyOdd.homePrice.value,
                totalTotal: totalOdd.overTotal.value,
                totalOverPrice: totalOdd.overTotalPrice.value,
                totalUnderPrice: totalOdd.underTotalPrice.value,
                exchangeId: exchangeId,
                gameId: gameId,
            },
        }).then(async ([sqlOdd, created]) => {
            if (!created) {
                // TODO: Insert code here that transfers the current odd over to 
                // OldOdd table.
                await sqlOdd.update({
                    spreadAwaySpread: spreadOdd.awaySpread.value,
                    spreadHomeSpread: spreadOdd.homeSpread.value,
                    spreadAwayPrice: spreadOdd.awayPrice.value,
                    spreadHomePrice: spreadOdd.homePrice.value,
                    moneyAwayPrice: moneyOdd.awayPrice.value,
                    moneyHomePrice: moneyOdd.homePrice.value,
                    totalTotal: totalOdd.overTotal.value,
                    totalOverPrice: totalOdd.overTotalPrice.value,
                    totalUnderPrice: totalOdd.underTotalPrice.value,
                });
            }
            this.wrappedSqlOdd = sqlOdd;
        });
        return this;
    }
    // instance methods
    matchesByExchangeAndGame({ exchange, game, }) {
        if (this.exchange === exchange && this.game === game) {
            return true;
        }
        return false;
    }
    async updateValues() {
        const spreadUpdatesMade = await this.spreadOdd.updateValues();
        const moneyUpdatesMade = await this.moneyOdd.updateValues();
        const totalUpdatesMade = await this.totalOdd.updateValues();
        if (spreadUpdatesMade || moneyUpdatesMade || totalUpdatesMade) {
            await this.sqlOdd.update({
                spreadAwaySpread: this.spreadOdd.awaySpread.value,
                spreadHomeSpread: this.spreadOdd.homeSpread.value,
                spreadAwayPrice: this.spreadOdd.awayPrice.value,
                spreadHomePrice: this.spreadOdd.homePrice.value,
                moneyAwayPrice: this.moneyOdd.awayPrice.value,
                moneyHomePrice: this.moneyOdd.homePrice.value,
                totalTotal: this.totalOdd.overTotal.value,
                totalOverPrice: this.totalOdd.overTotalPrice.value,
                totalUnderPrice: this.totalOdd.underTotalPrice.value,
            });
            console.log(`UPDATED: ${this.exchange.name} ${this.game.regionAbbrIdentifierAbbr}`);
        }
    }
    // getters and setters
    get sqlOdd() {
        if (this.wrappedSqlOdd) {
            return this.wrappedSqlOdd;
        }
        else {
            throw new Error(`${this.exchange.name} ${this.game.regionAbbrIdentifierAbbr} Odd sqlOdd is null.`);
        }
    }
    set sqlOdd(sqlOdd) {
        this.wrappedSqlOdd = sqlOdd;
    }
}
exports.Odd = Odd;
class SpreadOdd extends elementWrappers.ElementWrapper {
    constructor({ exchange, game, parent, }) {
        super({
            exchange: exchange,
            game: game,
            odd: parent,
            updateElementFunction: fanDuel.spreadOdd,
        });
        this.awaySpread = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.awaySpread,
        });
        this.awayPrice = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.awaySpreadPrice,
        });
        this.homeSpread = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.homeSpread,
        });
        this.homePrice = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.homeSpreadPrice,
        });
    }
    async updateValues() {
        const awaySpreadUpdated = await this.awaySpread.updateValue();
        const awayPriceUpdated = await this.awayPrice.updateValue();
        const homeSpreadUpdated = await this.homeSpread.updateValue();
        const homePriceUpdated = await this.homePrice.updateValue();
        if (awaySpreadUpdated || awayPriceUpdated || homeSpreadUpdated || homePriceUpdated) {
            return true;
        }
        return false;
    }
}
exports.SpreadOdd = SpreadOdd;
class MoneyOdd extends elementWrappers.ElementWrapper {
    constructor({ exchange, game, parent, }) {
        super({
            exchange: exchange,
            game: game,
            odd: parent,
            updateElementFunction: fanDuel.moneyOdd,
        });
        this.awayPrice = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.awayMoneyPrice,
        });
        this.homePrice = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.homeMoneyPrice,
        });
    }
    async updateValues() {
        const awayPriceUpdated = await this.awayPrice.updateValue();
        const moneyPriceUpdated = await this.homePrice.updateValue();
        if (awayPriceUpdated || moneyPriceUpdated) {
            return true;
        }
        return false;
    }
}
exports.MoneyOdd = MoneyOdd;
class TotalOdd extends elementWrappers.ElementWrapper {
    constructor({ exchange, game, parent, }) {
        super({
            exchange: exchange,
            game: game,
            odd: parent,
            updateElementFunction: fanDuel.totalOdd,
        });
        this.overTotal = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.overTotal,
        });
        this.overTotalPrice = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.overTotalPrice,
        });
        this.underTotal = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.underTotal,
        });
        this.underTotalPrice = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.underTotalPrice,
        });
    }
    async updateValues() {
        const overTotalUpdated = await this.overTotal.updateValue();
        const overPriceUpdated = await this.overTotalPrice.updateValue();
        const underTotalUpdated = await this.underTotal.updateValue();
        const underPriceUpdated = await this.underTotalPrice.updateValue();
        if (overTotalUpdated || overPriceUpdated || underTotalUpdated || underPriceUpdated) {
            return true;
        }
        return false;
    }
}
exports.TotalOdd = TotalOdd;
//# sourceMappingURL=odd.js.map