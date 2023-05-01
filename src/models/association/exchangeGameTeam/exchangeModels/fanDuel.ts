import { ElementHandle } from "puppeteer";

import * as localModels from '../../../../models';

export abstract class FanDuelExchangeGameTeam extends localModels.ExchangeGameTeam {
    public element: ElementHandle | null;
    protected abstract xPathFromExchangeGame: string;

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
            exchange,
            game,
            team,
        });
        this.element = null;
    }

    public async updateElement(): Promise<ElementHandle | null> {
        const exchangeGame = this.exchangeGame;

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

    get exchangeGame(): localModels.ExchangeGame {
        if (!this.wrappedExchangeGame) {
            throw new Error(`ExchangeGame is null.`);
        }

        return this.wrappedExchangeGame;
    }

    set exchangeGame(exchangeGame: localModels.ExchangeGame) {
        this.wrappedExchangeGame = exchangeGame;
        exchangeGame.exchangeGameAwayTeam = this;
    }
}

export class FanDuelExchangeGameAwayTeam extends FanDuelExchangeGameTeam {
    protected xPathFromExchangeGame: string = 'div[1]/div/div[1]';
}

export class FanDuelExchangeGameHomeTeam extends FanDuelExchangeGameTeam {
    protected xPathFromExchangeGame: string = 'div[1]/div/div[2]';
}