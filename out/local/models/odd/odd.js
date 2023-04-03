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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalOdd = exports.Odd = void 0;
const databaseModels = __importStar(require("../../../database/models"));
const globalModels = __importStar(require("../../../global/models"));
class Odd {
    constructor({ exchange, game, } = {}) {
        this.spreadOdd = new SpreadOdd();
        this.moneyOdd = new MoneyOdd();
        this.overUnderOdd = new TotalOdd();
        if (exchange) {
            this.wrappedExchange = exchange;
        }
        else {
            this.wrappedExchange = null;
        }
        if (game) {
            this.wrappedGame = game;
        }
        else {
            this.wrappedGame = null;
        }
        this.wrappedBaseHandle = null;
        this.wrappedSqlOdd = null;
    }
    // async construction methods
    static create({ exchange, game, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOdd = new Odd();
            if (exchange) {
                newOdd.wrappedExchange = exchange;
                exchange.oddSet.add(newOdd);
            }
            if (game) {
                newOdd.wrappedGame = game;
                game.oddSet.add(newOdd);
            }
            yield newOdd.init();
            globalModels.allOdds.add(newOdd);
            return newOdd;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const exchange = this.exchange;
            const game = this.game;
            const awayTeam = game.awayTeam;
            const homeTeam = game.homeTeam;
            const exchangeId = exchange.sqlExchange.get('id');
            const gameId = game.sqlGame.get('id');
            const awayTeamId = awayTeam.sqlTeam.get('id');
            const homeTeamId = homeTeam.sqlTeam.get('id');
            const spreadOdd = this.spreadOdd;
            const moneyOdd = this.moneyOdd;
            const totalOdd = this.overUnderOdd;
            yield databaseModels.Odd.findOrCreate({
                where: {
                    exchangeId: exchangeId,
                    gameId: gameId,
                },
                defaults: {
                    spreadAwaySpread: spreadOdd.awaySpread,
                    spreadHomeSpread: spreadOdd.homeSpread,
                    spreadAwayPrice: spreadOdd.awayPrice,
                    spreadHomePrice: spreadOdd.homePrice,
                    moneyAwayPrice: moneyOdd.awayPrice,
                    moneyHomePrice: moneyOdd.homePrice,
                    totalTotal: totalOdd.total,
                    totalOverPrice: totalOdd.overPrice,
                    totalUnderPrice: totalOdd.underPrice,
                    exchangeId: exchangeId,
                    gameId: gameId,
                    awayTeamId: awayTeamId,
                    homeTeamId: homeTeamId,
                },
            }).then(([sqlOdd, created]) => __awaiter(this, void 0, void 0, function* () {
                if (!created) {
                    // TODO: Insert code here that transfers the current odd over to 
                    // OldOdd table.
                    yield sqlOdd.update({
                        spreadAwaySpread: spreadOdd.awaySpread,
                        spreadHomeSpread: spreadOdd.homeSpread,
                        spreadAwayPrice: spreadOdd.awayPrice,
                        spreadHomePrice: spreadOdd.homePrice,
                        moneyAwayPrice: moneyOdd.awayPrice,
                        moneyHomePrice: moneyOdd.homePrice,
                        totalTotal: totalOdd.total,
                        totalOverPrice: totalOdd.overPrice,
                        totalUnderPrice: totalOdd.underPrice,
                        awayTeamId: awayTeamId,
                        homeTeamId: homeTeamId,
                    });
                }
            }));
        });
    }
    // instance methods
    matchesByExchangeAndGame({ exchange, game, }) {
        if (this.exchange === exchange && this.game === game) {
            return true;
        }
        return false;
    }
    // getters and setters
    get baseHandle() {
        if (this.wrappedBaseHandle) {
            return this.wrappedBaseHandle;
        }
        else {
            throw new Error(`${this.exchange.name} ${this.game.name} Odd baseHandle is null.`);
        }
    }
    set baseHandle(baseHandle) {
        this.wrappedBaseHandle = baseHandle;
    }
    get exchange() {
        if (this.wrappedExchange) {
            return this.wrappedExchange;
        }
        else {
            throw new Error(`${this.game.name} Odd exchange is null.`);
        }
    }
    set exchange(exchange) {
        this.wrappedExchange = exchange;
    }
    get game() {
        if (this.wrappedGame) {
            return this.wrappedGame;
        }
        else {
            throw new Error(`${this.exchange.name} Odd game is null.`);
        }
    }
    set game(game) {
        this.game = game;
    }
    get sqlOdd() {
        if (this.wrappedSqlOdd) {
            return this.wrappedSqlOdd;
        }
        else {
            throw new Error(`${this.exchange.name} ${this.game.name} Odd sqlOdd is null.`);
        }
    }
    set sqlOdd(sqlOdd) {
        this.wrappedSqlOdd = sqlOdd;
    }
}
exports.Odd = Odd;
class SpreadOdd {
    constructor() {
        this.wrappedAwaySpread = null;
        this.wrappedAwayPrice = null;
        this.wrappedHomeSpread = null;
        this.wrappedHomePrice = null;
    }
    get awaySpread() {
        return this.wrappedAwaySpread;
    }
    set awaySpread(awaySpread) {
        if (awaySpread === null) {
            this.wrappedAwaySpread = awaySpread;
        }
        else {
            this.wrappedAwaySpread = Number(awaySpread);
        }
    }
    get awayPrice() {
        return this.wrappedAwayPrice;
    }
    set awayPrice(awayPrice) {
        if (awayPrice === null) {
            this.wrappedAwayPrice = awayPrice;
        }
        else {
            this.wrappedAwayPrice = Number(awayPrice);
        }
    }
    get homeSpread() {
        return this.wrappedHomeSpread;
    }
    set homeSpread(homeSpread) {
        if (homeSpread === null) {
            this.wrappedHomeSpread = homeSpread;
        }
        else {
            this.wrappedHomeSpread = Number(homeSpread);
        }
    }
    get homePrice() {
        return this.wrappedHomePrice;
    }
    set homePrice(homePrice) {
        if (homePrice === null) {
            this.wrappedHomePrice = homePrice;
        }
        else {
            this.wrappedHomePrice = Number(homePrice);
        }
    }
}
class MoneyOdd {
    constructor() {
        this.wrappedAwayPrice = null;
        this.wrappedHomePrice = null;
    }
    get awayPrice() {
        return this.wrappedAwayPrice;
    }
    set awayPrice(awayPrice) {
        if (awayPrice === null) {
            this.wrappedAwayPrice = awayPrice;
        }
        else {
            this.wrappedAwayPrice = Number(awayPrice);
        }
    }
    get homePrice() {
        return this.wrappedHomePrice;
    }
    set homePrice(homePrice) {
        if (homePrice === null) {
            this.wrappedHomePrice = homePrice;
        }
        else {
            this.wrappedHomePrice = Number(homePrice);
        }
    }
}
class TotalOdd {
    constructor() {
        this.wrappedTotal = null;
        this.wrappedOverPrice = null;
        this.wrappedUnderPrice = null;
    }
    get total() {
        return this.wrappedTotal;
    }
    set total(total) {
        if (total === null) {
            this.wrappedTotal = total;
        }
        else {
            this.wrappedTotal = Number(total);
        }
    }
    get overPrice() {
        return this.wrappedOverPrice;
    }
    set overPrice(overPrice) {
        if (overPrice === null) {
            this.wrappedOverPrice = overPrice;
        }
        else {
            this.wrappedOverPrice = Number(overPrice);
        }
    }
    get underPrice() {
        return this.wrappedUnderPrice;
    }
    set underPrice(underPrice) {
        if (underPrice === null) {
            this.wrappedUnderPrice = underPrice;
        }
        else {
            this.wrappedUnderPrice = Number(underPrice);
        }
    }
}
exports.TotalOdd = TotalOdd;
//# sourceMappingURL=odd.js.map