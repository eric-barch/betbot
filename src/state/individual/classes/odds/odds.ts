import * as state from '../../../../state';

export class Odds {
    private game: state.Game | undefined;
    private exchange: state.Exchange | undefined;
    private spreadOdds: state.SpreadOdds;
    private moneyOdds: state.MoneyOdds;
    private overUnderOdds: state.OverUnderOdds;

    constructor({
        game,
        exchange,
        verbose = false,
    }: {
        game?: state.Game,
        exchange?: state.Exchange,
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

        this.spreadOdds = new state.SpreadOdds();
        this.moneyOdds = new state.MoneyOdds();
        this.overUnderOdds = new state.OverUnderOdds();
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