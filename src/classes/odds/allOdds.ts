import * as classes from '../../classes';
import * as state from '../../state';

export class AllOdds {
    private odds: Array<classes.Odds>;

    constructor({
        odds,
    }: {
        odds?: Array<classes.Odds>,
    } = {}) {
        if (odds) {
            this.odds = odds;
        } else {
            this.odds = [];
        }
    }
}