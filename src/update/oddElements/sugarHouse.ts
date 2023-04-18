import { ElementHandle } from 'puppeteer';

import * as localModels from '../../local';

export const sugarHouse = {
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
    })

    const gameElement = exchangeGame.element;

    if (!gameElement) {
        this.priceElement = null;
        this.valueElement = null;

        return {
            priceElement: null,
            valueElement: null,
        }
    }

    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]
    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]/div/div/div/div[1]/div[4]/div/div[1]/div[1]/button/div[2]/ul/li
    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]/div/div/div/div[1]/div[4]/div/div[1]/div[1]/button/div[1]

    const priceElement = await gameElement.$('xpath/div/div/div/div[1]/div[4]/div/div[1]/div[1]/button/div[2]/ul/li');
    const valueElement = await gameElement.$('xpath/div/div/div/div[1]/div[4]/div/div[1]/div[1]/button/div[1]');

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
    })

    const gameElement = exchangeGame.element;

    if (!gameElement) {
        this.priceElement = null;
        this.valueElement = null;

        return {
            priceElement: null,
            valueElement: null,
        }
    }

    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]
    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]/div/div/div/div[1]/div[4]/div/div[1]/div[2]/button/div[2]/ul/li
    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]/div/div/div/div[1]/div[4]/div/div[1]/div[2]/button/div[1]

    const priceElement = await gameElement.$('xpath/div/div/div/div[1]/div[4]/div/div[1]/div[2]/button/div[2]/ul/li');
    const valueElement = await gameElement.$('xpath/div/div/div/div[1]/div[4]/div/div[1]/div[2]/button/div[1]');

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

    const gameElement = exchangeGame.element;

    if (!gameElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]
    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]/div/div/div/div[1]/div[4]/div/div[2]/div[1]/button/div/ul/li

    const priceElement = await gameElement.$('xpath/div/div/div/div[1]/div[4]/div/div[2]/div[1]/button/div/ul/li');

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

    const gameElement = exchangeGame.element;

    if (!gameElement) {
        this.priceElement = null;
        this.valueElement = null;
        return {
            priceElement: null,
            valueElement: null,
        }
    }

    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]
    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]/div/div/div/div[1]/div[4]/div/div[2]/div[2]/button/div/ul/li

    const priceElement = await gameElement.$('xpath/div/div/div/div[1]/div[4]/div/div[2]/div[2]/button/div/ul/li');

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
    })

    const gameElement = exchangeGame.element;

    if (!gameElement) {
        this.priceElement = null;
        this.valueElement = null;

        return {
            priceElement: null,
            valueElement: null,
        }
    }

    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]
    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]/div/div/div/div[1]/div[4]/div/div[3]/div[1]/button/div[2]/ul/li
    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]/div/div/div/div[1]/div[4]/div/div[3]/div[1]/button/div[1]

    const priceElement = await gameElement.$('xpath/div/div/div/div[1]/div[4]/div/div[3]/div[1]/button/div[2]/ul/li');
    const valueElement = await gameElement.$('xpath/div/div/div/div[1]/div[4]/div/div[3]/div[1]/button/div[1]');

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
    })

    const gameElement = exchangeGame.element;

    if (!gameElement) {
        this.priceElement = null;
        this.valueElement = null;

        return {
            priceElement: null,
            valueElement: null,
        }
    }

    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]
    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]/div/div/div/div[1]/div[4]/div/div[3]/div[2]/button/div[2]/ul/li
    //html/body/div[2]/div[1]/div[2]/div/div/main/section/div[5]/div/div/div/div[2]/div/div/article[1]/div/div/div/div[1]/div[4]/div/div[3]/div[2]/button/div[1]

    const priceElement = await gameElement.$('xpath/div/div/div/div[1]/div[4]/div/div[3]/div[2]/button/div[2]/ul/li');
    const valueElement = await gameElement.$('xpath/div/div/div/div[1]/div[4]/div/div[3]/div[2]/button/div[1]');

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