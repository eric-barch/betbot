import * as classes from '..';
import * as state from '../../state';

export class AllOdds {
    private odds: Array<classes.odds.Odds>;

    constructor({
        odds,
    }: {
        odds?: Array<classes.odds.Odds>,
    } = {}) {
        if (odds) {
            this.odds = odds;
        } else {
            this.odds = [];
        }
    }
}