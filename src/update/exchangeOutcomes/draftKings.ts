import * as globalModels from '../../global';
import * as localModels from '../../local';

export async function draftKings(this: localModels.Exchange): Promise<localModels.OddSet> {
    for (const exchangeGame of this.getExchangeGames()) {
        const spreadAway = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.getGame(),
            name: 'spread_away',
        });
        await this.getOdds().findOrCreate({
            exchange: this,
            outcome: spreadAway,
        });
    
        const spreadHome = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.getGame(),
            name: 'spread_home',
            oppositeOutcome: spreadAway,
        });
        await this.getOdds().findOrCreate({
            exchange: this,
            outcome: spreadHome,
        });

        const moneylineAway = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.getGame(),
            name: 'moneyline_away',
        });
        await this.getOdds().findOrCreate({
            exchange: this,
            outcome: moneylineAway,
        });

        const moneylineHome = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.getGame(),
            name: 'moneyline_home',
            oppositeOutcome: moneylineAway,
        });
        await this.getOdds().findOrCreate({
            exchange: this,
            outcome: moneylineHome,
        });

        const totalOver = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.getGame(),
            name: 'total_over',
        });
        await this.getOdds().findOrCreate({
            exchange: this,
            outcome: totalOver,
        });

        const totalUnder = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.getGame(),
            name: 'total_under',
            oppositeOutcome: totalOver,
        });
        await this.getOdds().findOrCreate({
            exchange: this,
            outcome: totalUnder,
        });
    }

    return this.getOdds();
}