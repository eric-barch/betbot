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
exports.OverUnderOdds = exports.Odds = void 0;
const databaseModels = __importStar(require("../../database/models"));
class Odds {
    constructor({ exchange, game, } = {}) {
        if (exchange) {
            this.exchange = exchange;
        }
        else {
            this.exchange = null;
        }
        if (game) {
            this.game = game;
        }
        else {
            this.game = null;
        }
        this.baseHandle = null;
        this.spreadOdds = new SpreadOdds();
        this.moneyOdds = new MoneyOdds();
        this.overUnderOdds = new OverUnderOdds();
        this.sequelizeInstance = null;
        this.updatedAt = null;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sequelizeInstance = new databaseModels.Odd();
        });
    }
    matchesByExchangeAndGame({ exchange, game, }) {
        if (this.exchange === exchange && this.game === game) {
            return true;
        }
        return false;
    }
    getBaseHandle() {
        if (this.baseHandle === null) {
            throw new Error(`${this.constructor.name}.${this.getBaseHandle.name} failed. BaseHandle is null.`);
        }
        else {
            return this.baseHandle;
        }
    }
    getGame() {
        if (this.game === null) {
            throw new Error(`${this.constructor.name}.${this.getGame.name} failed. Game is null.`);
        }
        else {
            return this.game;
        }
    }
    getExchange() {
        if (this.exchange === null) {
            throw new Error(`${this.constructor.name}.${this.getExchange.name} failed. Exchange is null.`);
        }
        else {
            return this.exchange;
        }
    }
    getSequelizeInstance() {
        return this.sequelizeInstance;
    }
    getSpreadOdds() {
        return this.spreadOdds;
    }
    getMoneyOdds() {
        return this.moneyOdds;
    }
    getOverUnderOdds() {
        return this.overUnderOdds;
    }
    setBaseHandle({ baseHandle, }) {
        this.baseHandle = baseHandle;
    }
    setUpdatedAt({ updatedAt, }) {
        this.updatedAt = updatedAt;
    }
}
exports.Odds = Odds;
class SpreadOdds {
    constructor() {
        this.awaySpread = 0;
        this.awayPrice = 0;
        this.homeSpread = 0;
        this.homePrice = 0;
    }
    getAwaySpread() {
        return this.awaySpread;
    }
    getAwayPrice() {
        return this.awayPrice;
    }
    getHomeSpread() {
        return this.homeSpread;
    }
    getHomePrice() {
        return this.homePrice;
    }
    setAwaySpread({ awaySpread, }) {
        if (awaySpread === null) {
            this.awaySpread = null;
        }
        else {
            this.awaySpread = Number(awaySpread);
        }
    }
    setAwayPrice({ awayPrice, }) {
        if (awayPrice === null) {
            this.awayPrice = null;
        }
        else {
            this.awayPrice = Number(awayPrice);
        }
    }
    setHomeSpread({ homeSpread, }) {
        if (homeSpread === null) {
            this.homeSpread = null;
        }
        else {
            this.homeSpread = Number(homeSpread);
        }
    }
    setHomePrice({ homePrice, }) {
        if (homePrice === null) {
            this.homePrice = null;
        }
        else {
            this.homePrice = Number(homePrice);
        }
    }
}
class MoneyOdds {
    constructor() {
        this.awayPrice = 0;
        this.homePrice = 0;
    }
    getAwayPrice() {
        return this.awayPrice;
    }
    getHomePrice() {
        return this.homePrice;
    }
    setAwayPrice({ awayPrice, }) {
        if (awayPrice === null) {
            this.awayPrice = null;
        }
        else {
            this.awayPrice = Number(awayPrice);
        }
    }
    setHomePrice({ homePrice, }) {
        if (homePrice === null) {
            this.homePrice = null;
        }
        else {
            this.homePrice = Number(homePrice);
        }
    }
}
class OverUnderOdds {
    constructor() {
        this.overUnder = 0;
        this.overPrice = 0;
        this.underPrice = 0;
    }
    getOverUnder() {
        return this.overUnder;
    }
    getOverPrice() {
        return this.overPrice;
    }
    getUnderPrice() {
        return this.underPrice;
    }
    setOverUnder({ overUnder, }) {
        if (overUnder === null) {
            this.overUnder = null;
        }
        else {
            this.overUnder = Number(overUnder);
        }
    }
    setOverPrice({ overPrice, }) {
        if (overPrice === null) {
            this.overPrice = null;
        }
        else {
            this.overPrice = Number(overPrice);
        }
    }
    setUnderPrice({ underPrice, }) {
        if (underPrice === null) {
            this.underPrice = null;
        }
        else {
            this.underPrice = Number(underPrice);
        }
    }
}
exports.OverUnderOdds = OverUnderOdds;
//# sourceMappingURL=odds.js.map