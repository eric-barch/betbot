import * as models from '../../../models';

export class Odds {
    private game: models.Game | undefined;
    private exchange: models.Exchange | undefined;
    private spreadOdds: models.SpreadOdds;
    private moneyOdds: models.MoneyOdds;
    private overUnderOdds: models.OverUnderOdds;

    constructor({
        game,
        exchange,
        verbose = false,
    }: {
        game?: models.Game,
        exchange?: models.Exchange,
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

        this.spreadOdds = new models.SpreadOdds();
        this.moneyOdds = new models.MoneyOdds();
        this.overUnderOdds = new models.OverUnderOdds();
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