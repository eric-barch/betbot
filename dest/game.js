"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const teams_1 = require("./teams");
class Game {
    constructor({ awayTeam, homeTeam, dateTime, }) {
        this.awayTeam = teams_1.teams.get(awayTeam);
        this.homeTeam = teams_1.teams.get(homeTeam);
        this.dateTime = dateTime;
        this.odds = new Map;
    }
}
exports.Game = Game;
