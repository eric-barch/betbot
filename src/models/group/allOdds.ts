import * as models from '..';

export class AllOdds {
    private odds: Array<models.Odds>;

    constructor({
        odds,
    }: {
        odds?: Array<models.Odds>,
    } = {}) {
        if (odds) {
            this.odds = odds;
        } else {
            this.odds = [];
        }
    }
}