import * as classes from '../../classes';

export class Game {
    private awayTeam: classes.Team;
    private homeTeam: classes.Team;
    private startDate: Date;
    private exchanges: Array<classes.Exchange>;
    private odds: Array<classes.Odds>;

    constructor({
        awayTeam,
        homeTeam,
        startDate,
        exchanges,
        verbose,
    }: {
        awayTeam: classes.Team,
        homeTeam: classes.Team,
        startDate: Date,
        exchanges?: classes.Exchange | Array<classes.Exchange>,
        verbose?: boolean,
    }) {
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;   
        this.startDate = startDate;

        this.exchanges = [];
        if (exchanges) {
            if (Array.isArray(exchanges)) {

            } else {
                this.exchanges.push(exchanges);
            }
        } else {
            verbose ? console.log(`\tNo exchanges passed to Game constructor.`) : null;
        }

        verbose ? console.log(`\tgame.exchanges set to ${this.getExchanges()}`) : null;

        this.odds = [];
    }

    public match({
        awayTeam,
        homeTeam,
        startDate,
        verbose,
    }: {
        awayTeam: classes.Team,
        homeTeam: classes.Team,
        startDate?: Date,
        verbose?: boolean,
    }) {
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

    public getAwayTeam({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.awayTeam;
    }

    public getHomeTeam({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.homeTeam;
    }

    public getStartDate({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.startDate;
    }

    public getExchanges({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.exchanges;
    }

    public getOdds({
        exchanges,
        verbose = false,
    }: {
        exchanges?: classes.Exchange | Array<classes.Exchange>,
        verbose?: boolean,
    } = {}) {
        if (exchanges) {
            if (Array.isArray(exchanges)) {
                let oddsArray = new Array<classes.Odds>;
                for (let exchange of exchanges) {
                    let odds = this.odds.find(odds => odds.getExchange() === exchange);
                    if (odds === undefined) {
                        odds = new classes.Odds({
                            game: this,
                            exchange: exchange,
                        });
                        this.odds.push(odds);
                    }
                    oddsArray.push(odds);
                }
                return oddsArray;
            } else {
                let odds = this.odds.find(odds => odds.getExchange() === exchanges);
                if (odds === undefined) {
                    odds = new classes.Odds({
                        game: this,
                        exchange: exchanges,
                    });
                    this.odds.push(odds);
                }
                return odds;
            }
        } else {
            return this.odds;
        }
    }

}