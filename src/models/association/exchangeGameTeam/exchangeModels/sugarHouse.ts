import { ElementHandle } from "puppeteer";

import { ExchangeGameTeam } from "../exchangeGameTeam";

import * as localModels from '../../..';

export class SugarHouseExchangeGameAwayTeam extends ExchangeGameTeam {
    public async updateElement(): Promise<ElementHandle | null> {
        return null;
    }
}

export class SugarHouseExchangeGameHomeTeam extends ExchangeGameTeam {
    public async updateElement(): Promise<ElementHandle | null> {
        return null;
    }
}