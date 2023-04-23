import { ElementHandle } from "puppeteer";

import { ExchangeGameTeam } from "../exchangeGameTeam";

import * as localModels from '../../../../local';

export class SugarHouseExchangeGameAwayTeam extends ExchangeGameTeam {
    public async updateElement(): Promise<ElementHandle | null> {
        this.element = null;
        return null;
    }

    public setExchangeGame(exchangeGame: localModels.ExchangeGame) {
        this.wrappedExchangeGame = exchangeGame;
        exchangeGame.setExchangeGameAwayTeam(this);
    }
}

export class SugarHouseExchangeGameHomeTeam extends ExchangeGameTeam {
    public async updateElement(): Promise<ElementHandle | null> {
        this.element = null;
        return null;
    }

    public setExchangeGame(exchangeGame: localModels.ExchangeGame) {
        this.wrappedExchangeGame = exchangeGame;
        exchangeGame.setExchangeGameHomeTeam(this);
    }
}