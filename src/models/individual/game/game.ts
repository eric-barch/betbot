import * as models from '../../../models';

export class Game {
    private awayTeam: models.Team;
    private homeTeam: models.Team;
    private startDate: Date;
    private exchanges: Array<models.Exchange>;
    private odds: Array<models.Odds>;

    constructor({
        awayTeam,
        homeTeam,
        startDate,
        exchanges,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
        startDate: Date,
        exchanges?: models.Exchange | Array<models.Exchange>,
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
        }

        this.odds = [];
    }

    public match({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
        startDate?: Date,
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

    public getAwayTeam() {
        return this.awayTeam;
    }

    public getHomeTeam() {
        return this.homeTeam;
    }

    public getStartDate() {
        return this.startDate;
    }

    public getExchanges() {
        return this.exchanges;
    }

    public getOdds({
        exchanges,
    }: {
        exchanges?: models.Exchange | Array<models.Exchange>,
    } = {}) {
        if (exchanges) {
            if (Array.isArray(exchanges)) {
                let oddsArray = new Array<models.Odds>;
                for (let exchange of exchanges) {
                    let odds = this.odds.find(odds => odds.getExchange() === exchange);
                    if (odds === undefined) {
                        odds = new models.Odds({
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
                    odds = new models.Odds({
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