import { ElementHandle } from "puppeteer";

import * as models from '../../../../models';

export class SugarHouseExchangeGameTeam extends models.ExchangeGameTeam {
    constructor({
        exchange,
        game,
        team,
    }: {
        exchange: models.Exchange,
        game: models.Game,
        team: models.Team,
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