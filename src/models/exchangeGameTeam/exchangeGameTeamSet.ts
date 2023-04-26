import * as localModels from '../../models';

import { ExchangeGameTeam } from './exchangeGameTeam';

export class ExchangeGameTeamSet extends Set<ExchangeGameTeam> {
    public find({
        exchange,
        game,
        team,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        team: localModels.Team,
    }): ExchangeGameTeam | null {
        for (const exchangeGameTeam of this) {
            if (exchangeGameTeam.matches({
                exchange: exchange,
                game: game,
                team: team,
            })) {
                return exchangeGameTeam;
            }
        }

        return null;
    }

    public async findOrCreate({
        exchange,
        game,
        team,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        team: localModels.Team,
    }) {
        const foundExchangeGameTeam = this.find({
            exchange: exchange,
            game: game,
            team: team,
        });

        if (foundExchangeGameTeam) {
            return foundExchangeGameTeam;
        }

        const exchangeGameTeam = await ExchangeGameTeam.create({
            exchange: exchange,
            game: game,
            team: team,
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