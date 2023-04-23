import { ElementHandle } from "puppeteer";

import { ExchangeGameTeam } from "../exchangeGameTeam";

import * as localModels from '../../../../local';

export class FanDuelExchangeGameAwayTeam extends ExchangeGameTeam {
    public xPathFromExchangeGame: string = 'div[1]/div/div[1]';

    public async updateElement(): Promise<ElementHandle | null> {
        const exchangeGame = this.getExchangeGame();

        const exchangeGameElement = exchangeGame.element;
    
        if (!exchangeGameElement) {
            this.element = null;
            return null;
        }
    
        const teamElement = await exchangeGameElement.$(`xpath/${this.xPathFromExchangeGame}`);

        if (!teamElement) {
            throw new Error(`Provided team does not match.`);
        }
        
        this.element = teamElement;
        return teamElement;
    }

    public setExchangeGame(exchangeGame: localModels.ExchangeGame) {
        this.wrappedExchangeGame = exchangeGame;
        exchangeGame.setExchangeGameAwayTeam(this);
    }
}

export class FanDuelExchangeGameHomeTeam extends ExchangeGameTeam {
    public xPathFromExchangeGame: string = 'div[1]/div/div[2]';

    public async updateElement(): Promise<ElementHandle | null> {
        const exchangeGame = this.getExchangeGame();

        const exchangeGameElement = exchangeGame.element;
    
        if (!exchangeGameElement) {
            this.element = null;
            return null;
        }
    
        const teamElement = await exchangeGameElement.$(`xpath/${this.xPathFromExchangeGame}`);

        if (!teamElement) {
            throw new Error(`Provided team does not match.`);
        }
        
        this.element = teamElement;
        return teamElement;
    }

    public setExchangeGame(exchangeGame: localModels.ExchangeGame) {
        this.wrappedExchangeGame = exchangeGame;
        exchangeGame.setExchangeGameHomeTeam(this);
    }
}