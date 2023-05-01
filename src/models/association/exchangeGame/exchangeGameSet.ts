import { ExchangeGame } from './exchangeGame';
import * as models from '../../../models';

export class ExchangeGameSet extends Set<ExchangeGame> {
    public find({
        exchange,
        game,
    }: {
        exchange: models.Exchange,
        game: models.Game,
    }): ExchangeGame {
        for (const exchangeGame of this) {
            if (exchangeGame.matches({
                exchange: exchange,
                game: game,
            })) {
                return exchangeGame;
            }
        }

        throw new Error(`Did not find exchangeGame.`);
    }

    public async findOrCreate({
        exchange,
        game,
    }: {
        exchange: models.Exchange,
        game: models.Game,
    }): Promise<ExchangeGame> {
        let exchangeGame;

        try {
            exchangeGame = this.find({
                exchange: exchange,
                game: game,
            });
        } catch {
            exchangeGame = await ExchangeGame.create({
                exchange: exchange,
                game: game,
            });
        }

        this.add(exchangeGame);
        return exchangeGame;
    }

    public async updateElements(): Promise<ExchangeGameSet> {
        for (const exchangeGame of this) {
            await exchangeGame.updateElement();
        }

        return this;
    }
}