import { ElementHandle } from "puppeteer";

import * as localModels from '../../local';

export async function fanDuel(this: localModels.ExchangeGameTeam): Promise<ElementHandle | null> {
    const exchangeGame = this.exchangeGame;
    const game = exchangeGame.game;
    const team = this.team;

    const exchangeGameElement = exchangeGame.element;

    if (!exchangeGameElement) {
        this.element = null;
        return null;
    }

    if (team === game.awayTeam) {
        const teamElement = await exchangeGameElement.$('xpath/div[1]/div/div[1]');
        
        this.element = teamElement;
        return teamElement;
    }

    if (team === game.homeTeam) {
        const teamElement = await exchangeGameElement.$('xpath/div[1]/div/div[2]');
        
        this.element = teamElement;
        return teamElement;
    }

    throw new Error(`Provided team does not match the away or home team.`);
}