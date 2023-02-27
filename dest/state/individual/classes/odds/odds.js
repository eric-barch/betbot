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
exports.Odds = void 0;
const state = __importStar(require("../../../../state"));
class Odds {
    constructor({ game, exchange, verbose = false, } = {}) {
        if (game) {
            this.game = game;
        }
        else {
            this.game = undefined;
        }
        if (exchange) {
            this.exchange = exchange;
        }
        else {
            this.exchange = undefined;
        }
        this.spreadOdds = new state.SpreadOdds();
        this.moneyOdds = new state.MoneyOdds();
        this.overUnderOdds = new state.OverUnderOdds();
    }
    getGame({ verbose = false, } = {}) {
        return this.game;
    }
    getExchange({ verbose = false, } = {}) {
        return this.exchange;
    }
    getSpreadOdds({ verbose = false, } = {}) {
        return this.spreadOdds;
    }
    getMoneyOdds({ verbose = false, } = {}) {
        return this.moneyOdds;
    }
    getOverUnderOdds({ verbose = false, } = {}) {
        return this.overUnderOdds;
    }
}
exports.Odds = Odds;
