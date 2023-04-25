import * as localModels from '../../../local';

import { ExchangeGame } from './exchangeGame';

export class ExchangeGameSet extends Set<ExchangeGame> {
    public find({
        exchange,
        game,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
    }): ExchangeGame | null {
        for (const exchangeGame of this) {
            if (exchangeGame.matches({
                exchange: exchange,
                game: game,
            })) {
                return exchangeGame;
            }
        }

        return null;
    }

    public async findOrCreate({
        exchange,
        game,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
    }): Promise<ExchangeGame> {
        const foundExchangeGame = this.find({
            exchange: exchange,
            game: game,
        });

        if (foundExchangeGame) {
            return foundExchangeGame;
        }

        const newExchangeGame = await ExchangeGame.create({
            exchange: exchange,
            game: game,
        });

        this.add(newExchangeGame);
        return newExchangeGame;
    }

    public async updateElements(): Promise<ExchangeGameSet> {
        for (const exchangeGame of this) {
            await exchangeGame.updateElement();
        }

        return this;
    }
}