import * as puppeteer from 'puppeteer';

import * as models from '../../../models';

export class Game {
    private baseHandle?: puppeteer.ElementHandle;
    private awayTeam: models.Team;
    private homeTeam: models.Team;
    private startDate: Date;
    private exchangesGroup: models.ExchangesGroup;
    private oddsGroup: models.OddsGroup;

    constructor({
        awayTeam,
        homeTeam,
        startDate,
        exchanges: exchanges,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
        startDate: Date,
        exchanges?: models.Exchange | models.ExchangesGroup,
    }) {
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;   
        this.startDate = startDate;

        this.exchangesGroup = new models.ExchangesGroup;
        if (exchanges) {
            if (exchanges instanceof models.ExchangesGroup) {

            } else {
                this.exchangesGroup.push({exchange: exchanges});
            }
        }
        
        this.oddsGroup = new models.OddsGroup();
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

    public getBaseHandle() {
        return this.baseHandle;
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
        return this.exchangesGroup;
    }

    public getOddsGroup() {
        return this.oddsGroup;
    }

    // public getOdds({
    //     exchanges,
    // }: {
    //     exchanges?: models.Exchange | Array<models.Exchange>,
    // } = {}) {
    //     let requestedOdds;

    //     if (exchanges) {
    //         if (exchanges instanceof models.Exchange) {
    //             let exchangeOdds = this.oddsGroup.find(odds => odds.getExchange() === exchanges);
                
    //             if (exchangeOdds === undefined) {
    //                 exchangeOdds = new models.Odds({
    //                     game: this,
    //                     exchange: exchanges,
    //                 });
    //                 this.oddsGroup.push(exchangeOdds);
    //             }

    //             requestedOdds = exchangeOdds;
    //         } else {
    //             requestedOdds = new Array<models.Odds>;

    //             for (const exchange of exchanges) {
    //                 let exchangeOdds = this.oddsGroup.find(odds => odds.getExchange() === exchange);
                    
    //                 if (exchangeOdds === undefined) {
    //                     exchangeOdds = new models.Odds({
    //                         game: this,
    //                         exchange: exchange,
    //                     });
    //                     this.oddsGroup.push(exchangeOdds);
    //                 }
                    
    //                 requestedOdds.push(exchangeOdds);
    //             }
    //         }
    //     } else {
    //         requestedOdds = this.oddsGroup[0];

    //         if (requestedOdds === undefined) {
    //             this.oddsGroup.push(new models.Odds());
    //             requestedOdds = this.oddsGroup[0];
    //         }
    //     }

    //     return requestedOdds;
    // }

    public setBaseHandle({
        baseHandle,
    }: {
        baseHandle: puppeteer.ElementHandle,
    }) {
        this.baseHandle = baseHandle;
    }

}