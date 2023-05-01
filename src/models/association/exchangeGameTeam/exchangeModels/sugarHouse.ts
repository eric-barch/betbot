import { ElementHandle } from "puppeteer";

import * as localModels from '../../../../models';

export class SugarHouseExchangeGameTeam extends localModels.ExchangeGameTeam {
    constructor({
        exchange,
        game,
        team,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        team: localModels.Team,
    }) {
        super({
            exchange: exchange,
            game: game,
            team: team,
        });
    }

    public async updateElement(): Promise<ElementHandle | null> {
        return null;
    }
}