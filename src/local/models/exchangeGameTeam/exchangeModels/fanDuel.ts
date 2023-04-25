import { ElementHandle } from "puppeteer";

import { ExchangeGameTeam } from "../exchangeGameTeam";

import * as localModels from '../../../../local';

export abstract class FanDuelExchangeGameTeam extends ExchangeGameTeam {
    public element: ElementHandle | null = null;
    protected abstract xPathFromExchangeGame: string;

    public async updateElement(): Promise<ElementHandle | null> {
        const exchangeGame = this.getExchangeGame();

        /**TODO: This is so hacky. May need to implement actual abstract factory to avoid having 
         * to do this. */
        if (!(exchangeGame instanceof localModels.FanDuelExchangeGame)) {
            throw new Error(`Expected instance of FanDuelExchangeGame.`);
        }

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

    public getExchangeGame(): localModels.ExchangeGame {
        if (!this.wrappedExchangeGame) {
            throw new Error(`ExchangeGame is null.`);
        }

        return this.wrappedExchangeGame;
    }

    public setExchangeGame(exchangeGame: localModels.ExchangeGame) {
        this.wrappedExchangeGame = exchangeGame;
        exchangeGame.setExchangeGameAwayTeam(this);
    }
}

export class FanDuelExchangeGameAwayTeam extends FanDuelExchangeGameTeam {
    protected xPathFromExchangeGame: string = 'div[1]/div/div[1]';
}

export class FanDuelExchangeGameHomeTeam extends FanDuelExchangeGameTeam {
    protected xPathFromExchangeGame: string = 'div[1]/div/div[2]';
}