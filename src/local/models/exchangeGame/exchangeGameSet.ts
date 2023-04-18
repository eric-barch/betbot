import * as localModels from '../../../local';
import * as updateFunctions from '../../../update';

import { ExchangeGame } from './exchangeGame';

export class ExchangeGameSet extends Set<ExchangeGame> {
    public async findOrCreate({
        exchange,
        game,
        updateElementFunction,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        updateElementFunction?: Function,
    }): Promise<ExchangeGame> {
        for (const exchangeGame of this) {
            if (exchangeGame.matches({
                exchange: exchange,
                game: game,
            })) {
                return exchangeGame;
            }
        }

        if (!updateElementFunction) {
            throw new Error(`${exchange.name} ${game.regionAbbrIdentifierAbbr} ExchangeGame not found. updateElementFunction require to instantiate new instance.`);
        }

        const exchangeGame = new ExchangeGame({
            exchange: exchange,
            game: game,
            updateElementFunction: updateElementFunction,
        });

        this.add(exchangeGame);

        return exchangeGame;
    }

    public async updateElements(): Promise<ExchangeGameSet> {
        for (const exchangeGame of this) {
            await exchangeGame.updateElement();
            await exchangeGame.updateExchangeGameTeams();
        }

        return this;
    }

    public async updateExchangeGameTeamElements(): Promise<ExchangeGameSet> {
        for (const exchangeGame of this) {
            await exchangeGame.exchangeGameTeams.updateElements();
        }

        return this;
    }
}