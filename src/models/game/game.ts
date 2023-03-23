import * as models from '../../models';

export class Game {
    private awayTeam: models.Team;
    private homeTeam: models.Team;
    private startDate: Date;
    private exchangesGroup: models.ExchangeSet;
    private oddsGroup: models.OddsSet;
    private sequelizeInstance: models.GameSequelizeInstance | null;

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
        this.sequelizeInstance = new models.GameSequelizeInstance({game: this});
        await this.sequelizeInstance.initialize();
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
        if (this.awayTeam === awayTeam && this.homeTeam === homeTeam) {
            const timeDifference = Math.abs(startDate.getTime() - this.getStartDate().getTime());
            const minutesDifference = timeDifference / 1000 / 60;
            const within15Minutes = minutesDifference <= 15;

            if (within15Minutes) {
                return true;
            }
        }

        return false;
    }

    public getAwayTeam() {
        return this.awayTeam;
    }

    public getHomeTeam() {
        return this.homeTeam;
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

}