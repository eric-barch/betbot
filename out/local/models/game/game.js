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
const globalModels = __importStar(require("../../../global"));
const localModels = __importStar(require("../../../local"));
class Game {
    // private linked objects
    // private constructor
    constructor({ awayTeam, homeTeam, startDate, }) {
        this.startDate = Game.roundDateToNearestInterval(startDate);
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;
        this.exchangeSet = new localModels.ExchangeSet();
        this.statisticSet = new localModels.StatisticSet();
    }
    // public async constructor
    static async create({ awayTeam, homeTeam, startDate, }) {
        const newGame = new Game({
            awayTeam: awayTeam,
            homeTeam: homeTeam,
            startDate: startDate,
        });
        await newGame.updateStatisticSet();
        globalModels.allGames.add(newGame);
        return newGame;
    }
    // public instance methods
    matches({ awayTeam, homeTeam, startDate, }) {
        startDate = Game.roundDateToNearestInterval(startDate);
        const awayTeamSame = (this.awayTeam === awayTeam);
        const homeTeamSame = (this.homeTeam === homeTeam);
        const startDateSame = (this.startDate.getTime() === startDate.getTime());
        if (awayTeamSame && homeTeamSame && startDateSame) {
            return true;
        }
        return false;
    }
    async updateStatisticSet() {
        const spread = await this.statisticSet.findOrCreate({
            game: this,
            name: 'spread',
        });
        const moneyline = await this.statisticSet.findOrCreate({
            game: this,
            name: 'moneyline',
        });
        const total = await this.statisticSet.findOrCreate({
            game: this,
            name: 'total',
        });
        this.statisticSet.add(spread);
        this.statisticSet.add(moneyline);
        this.statisticSet.add(total);
        return this.statisticSet;
    }
    // public static methods
    static roundDateToNearestInterval(date) {
        const ROUND_INTERVAL = 15;
        const roundedMinutes = Math.round(date.getMinutes() / ROUND_INTERVAL) * ROUND_INTERVAL;
        const roundedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), roundedMinutes, 0);
        return roundedDate;
    }
    // getters and setters
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
}
exports.Game = Game;
//# sourceMappingURL=game.js.map