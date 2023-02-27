import * as state from '../../../state';

export class AllOdds {
    private odds: Array<state.Odds>;

    constructor({
        odds,
    }: {
        odds?: Array<state.Odds>,
    } = {}) {
        if (odds) {
            this.odds = odds;
        } else {
            this.odds = [];
        }
    }
}