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
exports.Game = void 0;
const state = __importStar(require("../../../../state"));
class Game {
    constructor({ awayTeam, homeTeam, startDate, exchanges, verbose, }) {
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;
        this.startDate = startDate;
        this.exchanges = [];
        if (exchanges) {
            if (Array.isArray(exchanges)) {
            }
            else {
                this.exchanges.push(exchanges);
            }
        }
        else {
            verbose ? console.log(`\tNo exchanges passed to Game constructor.`) : null;
        }
        verbose ? console.log(`\tgame.exchanges set to ${this.getExchanges()}`) : null;
        this.odds = [];
    }
    match({ awayTeam, homeTeam, startDate, verbose, }) {
        if (startDate) {
            const timeDifference = Math.abs(startDate.getTime() - this.getStartDate().getTime());
            const minutesDifference = timeDifference / 1000 / 60;
            const within15Minutes = minutesDifference <= 15;
            if (!within15Minutes) {
                return false;
            }
        }
        if (this.awayTeam === awayTeam && this.homeTeam === homeTeam) {
            return true;
        }
        return false;
    }
    getAwayTeam({ verbose = false, } = {}) {
        return this.awayTeam;
    }
    getHomeTeam({ verbose = false, } = {}) {
        return this.homeTeam;
    }
    getStartDate({ verbose = false, } = {}) {
        return this.startDate;
    }
    getExchanges({ verbose = false, } = {}) {
        return this.exchanges;
    }
    getOdds({ exchanges, verbose = false, } = {}) {
        if (exchanges) {
            if (Array.isArray(exchanges)) {
                let oddsArray = new Array;
                for (let exchange of exchanges) {
                    let odds = this.odds.find(odds => odds.getExchange() === exchange);
                    if (odds === undefined) {
                        odds = new state.Odds({
                            game: this,
                            exchange: exchange,
                        });
                        this.odds.push(odds);
                    }
                    oddsArray.push(odds);
                }
                return oddsArray;
            }
            else {
                let odds = this.odds.find(odds => odds.getExchange() === exchanges);
                if (odds === undefined) {
                    odds = new state.Odds({
                        game: this,
                        exchange: exchanges,
                    });
                    this.odds.push(odds);
                }
                return odds;
            }
        }
        else {
            return this.odds;
        }
    }
}
exports.Game = Game;
