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
const models = __importStar(require("../../../models"));
class Game {
    constructor({ awayTeam, homeTeam, startDate, exchanges, }) {
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
        this.odds = [];
    }
    match({ awayTeam, homeTeam, startDate, }) {
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
    getBaseHandle() {
        return this.baseHandle;
    }
    getAwayTeam() {
        return this.awayTeam;
    }
    getHomeTeam() {
        return this.homeTeam;
    }
    getStartDate() {
        return this.startDate;
    }
    getExchanges() {
        return this.exchanges;
    }
    getOdds({ exchanges, } = {}) {
        let requestedOdds;
        if (exchanges) {
            if (exchanges instanceof models.Exchange) {
                let exchangeOdds = this.odds.find(odds => odds.getExchange() === exchanges);
                if (exchangeOdds === undefined) {
                    exchangeOdds = new models.Odds({
                        game: this,
                        exchange: exchanges,
                    });
                    this.odds.push(exchangeOdds);
                }
                requestedOdds = exchangeOdds;
            }
            else {
                requestedOdds = new Array;
                for (const exchange of exchanges) {
                    let exchangeOdds = this.odds.find(odds => odds.getExchange() === exchange);
                    if (exchangeOdds === undefined) {
                        exchangeOdds = new models.Odds({
                            game: this,
                            exchange: exchange,
                        });
                        this.odds.push(exchangeOdds);
                    }
                    requestedOdds.push(exchangeOdds);
                }
            }
        }
        else {
            requestedOdds = this.odds[0];
            if (requestedOdds === undefined) {
                this.odds.push(new models.Odds());
                requestedOdds = this.odds[0];
            }
        }
        return requestedOdds;
    }
    setBaseHandle({ baseHandle, }) {
        this.baseHandle = baseHandle;
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map