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
    }: {
        game?: models.Game,
        exchange?: models.Exchange,
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

    public getGame() {
        return this.game;
    }

    public getExchange() {
        return this.exchange;
    }

    public getSpreadOdds() {
        return this.spreadOdds;
    }

    public getMoneyOdds() {
        return this.moneyOdds;
    }

    public getOverUnderOdds() {
        return this.overUnderOdds;
    }
}