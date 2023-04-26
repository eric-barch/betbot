import { allExchanges } from '../exchanges';
import * as localModels from '../../../models';

class AllGames extends localModels.GameSet {
    public async init() {
        await this.update();
    }

    public async update() {
        let currentGames = new localModels.GameSet;

        for (const exchange of allExchanges) {
            const games = await exchange.updateGames();
            for (const game of games) {
                currentGames.add(game);
            }
        }

        for (const game of this) {
            if (!(currentGames.has(game))) {
                this.delete(game);
            }
        }
    }
}

export const allGames = new AllGames();