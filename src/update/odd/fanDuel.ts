import { ElementHandle } from "puppeteer";

import * as localModels from '../../local';

export const fanDuel = {
    spreadAway: spreadAway,
    spreadHome: spreadHome,
    moneylineAway: moneylineAway,
    moneylineHome: moneylineHome,
    totalOver: totalOver,
    totalUnder: totalUnder,
}

async function spreadAway(this: localModels.Odd): Promise<{
    priceElement: ElementHandle | null,
    valueElement: ElementHandle | null,
}> {
    const exchange = this.exchange;
    const game = this.outcome.game;

    const exchangeGame = await exchange.exchangeGames.findOrCreate({
        exchange: exchange,
        game: game,
    });

    const exchangeGameTeam = await exchangeGame.exchangeGameTeams.findOrCreate({
        exchangeGame: exchangeGame,
        team: game.awayTeam,
    });

    const teamRowElement = exchangeGameTeam.element;

    if (!teamRowElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    const priceElement = await teamRowElement.$('xpath/div[1]/span[2]');
    const valueElement = await teamRowElement.$('xpath/div[1]/span[1]');

    if (!priceElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    if (!valueElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    this.priceElement = priceElement;
    this.valueElement = valueElement;

    return {
        priceElement: priceElement,
        valueElement: valueElement,
    };
}

async function spreadHome(this: localModels.Odd): Promise<{
    priceElement: ElementHandle | null,
    valueElement: ElementHandle | null,
}> {
    const exchange = this.exchange;
    const game = this.outcome.game;

    const exchangeGame = await exchange.exchangeGames.findOrCreate({
        exchange: exchange,
        game: game,
    });

    const exchangeGameTeam = await exchangeGame.exchangeGameTeams.findOrCreate({
        exchangeGame: exchangeGame,
        team: game.homeTeam,
    });

    const teamRowElement = exchangeGameTeam.element;

    if (!teamRowElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    const priceElement = await teamRowElement.$('xpath/div[1]/span[2]');
    const valueElement = await teamRowElement.$('xpath/div[1]/span[1]');

    if (!priceElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    if (!valueElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    this.priceElement = priceElement;
    this.valueElement = valueElement;

    return {
        priceElement: priceElement,
        valueElement: valueElement,
    };
}

async function moneylineAway(this: localModels.Odd): Promise<{
    priceElement: ElementHandle | null,
    valueElement: null,
}> {
    const exchange = this.exchange;
    const game = this.outcome.game;

    const exchangeGame = await exchange.exchangeGames.findOrCreate({
        exchange: exchange,
        game: game,
    });

    const exchangeGameTeam = await exchangeGame.exchangeGameTeams.findOrCreate({
        exchangeGame: exchangeGame,
        team: game.awayTeam,
    });

    const teamRowElement = exchangeGameTeam.element;

    if (!teamRowElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    const priceElement = await teamRowElement.$('xpath/div[2]/span');

    if (!priceElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    this.priceElement = priceElement;
    this.valueElement = null;

    return {
        priceElement: priceElement,
        valueElement: null,
    };
}

async function moneylineHome(this: localModels.Odd): Promise<{
    priceElement: ElementHandle | null,
    valueElement: null,
}> {
    const exchange = this.exchange;
    const game = this.outcome.game;

    const exchangeGame = await exchange.exchangeGames.findOrCreate({
        exchange: exchange,
        game: game,
    });

    const exchangeGameTeam = await exchangeGame.exchangeGameTeams.findOrCreate({
        exchangeGame: exchangeGame,
        team: game.homeTeam,
    });

    const teamRowElement = exchangeGameTeam.element;

    if (!teamRowElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    const priceElement = await teamRowElement.$('xpath/div[2]/span');

    if (!priceElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    this.priceElement = priceElement;
    this.valueElement = null;

    return {
        priceElement: priceElement,
        valueElement: null,
    };
}

async function totalOver(this: localModels.Odd): Promise<{
    priceElement: ElementHandle | null,
    valueElement: ElementHandle | null,
}> {
    const exchange = this.exchange;
    const game = this.outcome.game;

    const exchangeGame = await exchange.exchangeGames.findOrCreate({
        exchange: exchange,
        game: game,
    });

    const exchangeGameTeam = await exchangeGame.exchangeGameTeams.findOrCreate({
        exchangeGame: exchangeGame,
        team: game.awayTeam,
    });

    const teamRowElement = exchangeGameTeam.element;

    if (!teamRowElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    const priceElement = await teamRowElement.$('xpath/div[3]/span[2]');
    const valueElement = await teamRowElement.$('xpath/div[3]/span[1]');

    if (!priceElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    if (!valueElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    this.priceElement = priceElement;
    this.valueElement = valueElement;

    return {
        priceElement: priceElement,
        valueElement: valueElement,
    };
}

async function totalUnder(this: localModels.Odd): Promise<{
    priceElement: ElementHandle | null,
    valueElement: ElementHandle | null,
}> {
    const exchange = this.exchange;
    const game = this.outcome.game;

    const exchangeGame = await exchange.exchangeGames.findOrCreate({
        exchange: exchange,
        game: game,
    });

    const exchangeGameTeam = await exchangeGame.exchangeGameTeams.findOrCreate({
        exchangeGame: exchangeGame,
        team: game.homeTeam,
    });

    const teamRowElement = exchangeGameTeam.element;

    if (!teamRowElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    const priceElement = await teamRowElement.$('xpath/div[3]/span[2]');
    const valueElement = await teamRowElement.$('xpath/div[3]/span[1]');

    if (!priceElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    if (!valueElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    this.priceElement = priceElement;
    this.valueElement = valueElement;

    return {
        priceElement: priceElement,
        valueElement: valueElement,
    };
}