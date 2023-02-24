import * as classes from '../../classes';

export class Odds {
    private game: classes.Game | undefined;
    private exchange: classes.Exchange | undefined;
    private spreadOdds: classes.SpreadOdds;
    private moneyOdds: classes.MoneyOdds;
    private overUnderOdds: classes.OverUnderOdds;

    constructor({
        game,
        exchange,
        verbose = false,
    }: {
        game?: classes.Game,
        exchange?: classes.Exchange,
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

        this.spreadOdds = new classes.SpreadOdds();
        this.moneyOdds = new classes.MoneyOdds();
        this.overUnderOdds = new classes.OverUnderOdds();
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