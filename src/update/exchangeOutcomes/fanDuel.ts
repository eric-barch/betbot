import * as globalModels from '../../global';
import * as localModels from '../../local';

export async function fanDuel(this: localModels.Exchange): Promise<localModels.OddSet> {
    for (const exchangeGame of this.exchangeGames) {
        const spreadAway = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.game,
            name: 'spread_away',
        });
        await this.odds.findOrCreate({
            exchange: this,
            outcome: spreadAway,
            updateElementsFunction: this.updateOddsFunctions.spreadAway,
        });
    
        const spreadHome = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.game,
            name: 'spread_home',
        });
        await this.odds.findOrCreate({
            exchange: this,
            outcome: spreadHome,
            updateElementsFunction: this.updateOddsFunctions.spreadHome,
        });

        const moneylineAway = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.game,
            name: 'moneyline_away',
        });
        await this.odds.findOrCreate({
            exchange: this,
            outcome: moneylineAway,
            updateElementsFunction: this.updateOddsFunctions.moneylineAway,
        });

        const moneylineHome = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.game,
            name: 'moneyline_home',
        });
        await this.odds.findOrCreate({
            exchange: this,
            outcome: moneylineHome,
            updateElementsFunction: this.updateOddsFunctions.moneylineHome,
        });

        const totalOver = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.game,
            name: 'total_over',
        });
        await this.odds.findOrCreate({
            exchange: this,
            outcome: totalOver,
            updateElementsFunction: this.updateOddsFunctions.totalOver,
        });

        const totalUnder = await globalModels.allOutcomes.findOrCreate({
            game: exchangeGame.game,
            name: 'total_under',
        });
        await this.odds.findOrCreate({
            exchange: this,
            outcome: totalUnder,
            updateElementsFunction: this.updateOddsFunctions.totalUnder,
        });
    }
    
    return this.odds;
}