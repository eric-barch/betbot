import * as databaseModels from '../../database/models';
import * as global from '../../global';
import * as models from '../../models';

export class Game {
    private awayTeam: models.Team;
    private homeTeam: models.Team;
    private startDate: Date;
    private exchangesGroup: models.ExchangeSet;
    private oddsGroup: models.OddsSet;
    private sequelizeInstance: databaseModels.GameSequelizeInstance | null;

    constructor({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
        startDate: Date,
    }) {
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;   
        this.startDate = startDate;

        this.exchangesGroup = new models.ExchangeSet;
        this.oddsGroup = new models.OddsSet();
        this.sequelizeInstance = null;
    }

    public async initialize() {
        this.sequelizeInstance = new databaseModels.GameSequelizeInstance({game: this});
        await this.sequelizeInstance.initialize();
    }

    public getOddsByExchange({
        exchange,
    }: {
        exchange: models.Exchange,
    }) {
        let requestedOdds = undefined;

        const gameOdds = this.oddsGroup;

        for (const odds of gameOdds) {
            if (odds.getExchange() === exchange) {
                requestedOdds = odds;
                break;
            }
        }

        if (requestedOdds === undefined) {
            requestedOdds = new models.Odds({
                exchange: exchange,
                game: this,
            })

            global.allOdds.add(requestedOdds);
        }

        return requestedOdds;
    }

    public matchesByTeamsAndStartDate({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
        startDate: Date,
    }) {
        startDate = Game.roundToNearestInterval(startDate);

        if (this.awayTeam === awayTeam && this.homeTeam === homeTeam && this.startDate === startDate) {
            return true;
        }

        return false;
    }

    public getAwayTeam() {
        return this.awayTeam;
    }

    public getHomeTeam() {
        return this.homeTeam;
    }

    public getName() {
        const name = `${this.getAwayTeam().getRegionAbbrIdentifierAbbr()} @ ${this.getHomeTeam().getRegionAbbrIdentifierAbbr()}`;
        return name;
    }

    public getSequelizeInstance() {
        return this.sequelizeInstance;
    }

    public getStartDate() {
        return this.startDate;
    }

    public getExchangesGroup() {
        return this.exchangesGroup;
    }

    public getOddsGroup() {
        return this.oddsGroup;
    }

    public static roundToNearestInterval(date: Date) {
        const ROUND_INTERVAL = 15;
        
        const roundedMinutes = Math.round(date.getMinutes() / ROUND_INTERVAL) * ROUND_INTERVAL;
        const roundedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), roundedMinutes, 0);

        return roundedDate;
    }
}