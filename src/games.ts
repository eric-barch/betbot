import { teams, Team } from "./teams";
import { Exchange } from "./exchanges";
import { ExchangeGameOdds } from "./odds";
import { MySqlGame, } from "./mysql";

export let games = [
    ['Arizona Cardinals', 'Atlanta Falcons', new Date()],
    ['Baltimore Ravens', 'Buffalo Bills', new Date()],
];

export class Game {
    private awayTeam: any;
    private homeTeam: any;
    private dateTime: any;
    private sequelizeModel: any;

    constructor({
        awayTeam,
        homeTeam,
        dateTime,
    }: {
        awayTeam: any,
        homeTeam: any,
        dateTime: any,
    }) {
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