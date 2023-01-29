"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.games = void 0;
exports.games = [
    ['Arizona Cardinals', 'Atlanta Falcons', new Date()],
    ['Baltimore Ravens', 'Buffalo Bills', new Date()],
];
class Game {
    constructor({ awayTeam, homeTeam, dateTime, }) {
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;
        this.dateTime = dateTime;
        // this.sequelizeModel = MySqlGame.create({
        //     awayTeam: this.getAwayTeam().getName(), 
        //     homeTeam: this.getHomeTeam().getName(),
        //     dateTime: this.getDateTime(),
        // });
    }
}
exports.Game = Game;
