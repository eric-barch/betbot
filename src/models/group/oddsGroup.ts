import * as models from '../../models';
import * as state from '../../state';

export class OddsGroup {
    private oddsArray: Array<models.Odds>;

    constructor({
        odds,
    }: {
        odds?: Array<models.Odds>,
    } = {}) {
        if (odds) {
            this.oddsArray = odds;
        } else {
            this.oddsArray = [];
        }
    }

    public getExchangeGameOdds({
        exchange,
        game,
    }: {
        exchange: models.Exchange,
        game: models.Game,
    }) {
        let exchangeGameOdds: models.Odds;
        
        const oddsFromGroup = this.oddsArray.find(oddsGroup => 
            oddsGroup.getExchange() === exchange && 
            oddsGroup.getGame() === game
        );

        if (oddsFromGroup instanceof models.Odds) {
            exchangeGameOdds = oddsFromGroup;
        } else {
            const newOdds = new models.Odds({
                exchange: exchange,
                game: game,
            });

            this.push({odds: newOdds});
            state.allOdds.push({odds: newOdds});

            exchangeGameOdds = newOdds;
        }

        return exchangeGameOdds;
    }

    public getLength() {
        return this.oddsArray.length;
    }

    public push({
        odds,
    }: {
        odds: models.Odds,
    }) {
        this.oddsArray.push(odds);
    }
}