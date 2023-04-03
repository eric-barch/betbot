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
exports.Game = void 0;
const databaseModels = __importStar(require("../../../database/models"));
const globalModels = __importStar(require("../../../global/models"));
const localModels = __importStar(require("../../../local/models"));
class Game {
    constructor({ awayTeam, homeTeam, startDate, }) {
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;
        this.startDate = Game.roundDateToNearestInterval(startDate);
        this.exchangeSet = new localModels.ExchangeSet;
        this.oddSet = new localModels.OddSet();
        this.wrappedSqlGame = null;
    }
    // async construction methods
    static create({ awayTeam, homeTeam, exchange, startDate, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newGame = new Game({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });
            if (exchange) {
                newGame.exchangeSet.add(exchange);
                exchange.gameSet.add(newGame);
            }
            yield newGame.init();
            globalModels.allGames.add(newGame);
            return newGame;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const awayTeam = this.awayTeam;
            const homeTeam = this.homeTeam;
            const startDate = this.startDate;
            const awayTeamId = awayTeam.sqlTeam.get('id');
            const homeTeamId = homeTeam.sqlTeam.get('id');
            yield databaseModels.Game.findOrCreate({
                where: {
                    awayTeamId: awayTeamId,
                    homeTeamId: homeTeamId,
                    startDate: startDate,
                },
                defaults: {
                    awayTeamId: awayTeamId,
                    homeTeamId: homeTeamId,
                    startDate: startDate,
                },
            }).then(([sqlGame, created]) => {
                this.wrappedSqlGame = sqlGame;
            });
        });
    }
    // instance methods
    getOddByExchange({ exchange, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestedOdd = undefined;
            const gameOdds = this.oddSet;
            for (const odd of gameOdds) {
                if (odd.exchange === exchange) {
                    requestedOdd = odd;
                    break;
                }
            }
            if (requestedOdd === undefined) {
                requestedOdd = yield localModels.Odd.create({
                    exchange: exchange,
                    game: this,
                });
            }
            return requestedOdd;
        });
    }
    matchesByTeamsAndStartDate({ awayTeam, homeTeam, exchange, startDate, }) {
        startDate = Game.roundDateToNearestInterval(startDate);
        const awayTeamSame = (this.awayTeam === awayTeam);
        const homeTeamSame = (this.homeTeam === homeTeam);
        const startDateSame = (this.startDate.getTime() === startDate.getTime());
        if (awayTeamSame && homeTeamSame && startDateSame) {
            if (exchange) {
                this.exchangeSet.add(exchange);
                exchange.gameSet.add(this);
            }
            return true;
        }
        return false;
    }
    // static methods
    static roundDateToNearestInterval(date) {
        const ROUND_INTERVAL = 15;
        const roundedMinutes = Math.round(date.getMinutes() / ROUND_INTERVAL) * ROUND_INTERVAL;
        const roundedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), roundedMinutes, 0);
        return roundedDate;
    }
    // getters and setters
    get name() {
        return this.regionAbbrIdentifierAbbr;
    }
    get regionAbbrIdentifierAbbr() {
        const regionAbbrIdentifierAbbr = `${this.awayTeam.regionAbbrIdentifierAbbr} @ ${this.homeTeam.regionAbbrIdentifierAbbr}`;
        return regionAbbrIdentifierAbbr;
    }
    get regionAbbrIdentifierFull() {
        const regionAbbrIdentifierFull = `${this.awayTeam.regionAbbrIdentifierFull} @ ${this.homeTeam.regionAbbrIdentifierFull}`;
        return regionAbbrIdentifierFull;
    }
    get regionFullIdentifierFull() {
        const regionFullIdentifierFull = `${this.awayTeam.regionFullIdentifierFull} @ ${this.homeTeam.regionFullIdentifierFull}`;
        return regionFullIdentifierFull;
    }
    get sqlGame() {
        if (this.wrappedSqlGame) {
            return this.wrappedSqlGame;
        }
        else {
            throw new Error(`${this.name} sqlGame is null.`);
        }
    }
    set sqlGame(sqlGame) {
        this.wrappedSqlGame = sqlGame;
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map