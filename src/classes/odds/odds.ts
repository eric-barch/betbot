import * as classes from '..';

export class Odds {
    private game: classes.games.Game | undefined;
    private exchange: classes.exchanges.Exchange | undefined;
    private spreadOdds: classes.odds.oddsComponents.SpreadOdds;
    private moneyOdds: classes.odds.oddsComponents.MoneyOdds;
    private overUnderOdds: classes.odds.oddsComponents.OverUnderOdds;

    constructor({
        game,
        exchange,
        verbose = false,
    }: {
        game?: classes.games.Game,
        exchange?: classes.exchanges.Exchange,
        verbose?: boolean,
    } = {}) {
        if (game) {
            this.game = game;
        } else {
            this.game = undefined;
        }

        if (exchange) {
            this.exchange = exchange;
        } else {
            this.exchange = undefined;
        }

        this.spreadOdds = new classes.odds.oddsComponents.SpreadOdds();
        this.moneyOdds = new classes.odds.oddsComponents.MoneyOdds();
        this.overUnderOdds = new classes.odds.oddsComponents.OverUnderOdds();
    }

    public getGame({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.game;
    }

    public getExchange({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.exchange;
    }

    public getSpreadOdds({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.spreadOdds;
    }

    public getMoneyOdds({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.moneyOdds;
    }

    public getOverUnderOdds({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.overUnderOdds;
    }
}