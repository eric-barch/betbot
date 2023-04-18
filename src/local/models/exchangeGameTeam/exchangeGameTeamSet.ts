import * as localModels from '../../../local';
import * as updateFunctions from '../../../update';

import { ExchangeGameTeam } from './exchangeGameTeam';

export class ExchangeGameTeamSet extends Set<ExchangeGameTeam> {
    public async findOrCreate({
        exchangeGame,
        team,
    }: {
        exchangeGame: localModels.ExchangeGame,
        team: localModels.Team,
    }) {
        for (const exchangeGameTeam of this) {
            if (exchangeGameTeam.matches({
                exchangeGame: exchangeGame,
                team: team,
            })) {
                return exchangeGameTeam;
            }
        }

        const exchangeGameTeam = new ExchangeGameTeam({
            exchangeGame: exchangeGame,
            team: team,
            updateElementFunction: exchangeGame.exchange.updateExchangeGameTeamsFunction,
        });

        this.add(exchangeGameTeam);

        return exchangeGameTeam;
    }

    public async updateElements(): Promise<ExchangeGameTeamSet> {
        for (const exchangeGameTeam of this) {
            await exchangeGameTeam.updateElement();
        }

        return this;
    }
}