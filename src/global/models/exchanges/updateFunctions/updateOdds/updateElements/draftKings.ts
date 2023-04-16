import { ElementHandle } from 'puppeteer';

import * as localModels from '../../../../../../local';

export async function spreadAway(this: localModels.Odd, {
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}): Promise<boolean> {
    if (this) {
        exchange = this.exchange;
        statistic = this.statistic;
    }

    const game = statistic.game;

    ///////////
    const teamRowElement = await getGameRows({
        exchange: exchange,
        statistic: statistic,
    });
    ///////////

    if (!teamRowElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    const valueElement = await teamRowElement.$('xpath/td[1]/div/div/div/div[1]/span');
    const priceElement = await teamRowElement.$('xpath/td[1]/div/div/div/div[2]/div[2]/span');

    if (!valueElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    if (!priceElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    if (this) {
        this.priceElement = priceElement;
        this.valueElement = valueElement;
    }

    return true;
}

export async function spreadHome(this: localModels.Odd, {
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}): Promise<boolean> {
    if (this) {
        exchange = this.exchange;
        statistic = this.statistic;
    }

    const game = statistic.game;

    const teamRowElement = await getGameRows({
        exchange: exchange,
        statistic: statistic,
        team: game.homeTeam,
    });

    if (!teamRowElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    const valueElement = await teamRowElement.$('xpath/td[1]/div/div/div/div[1]/span');
    const priceElement = await teamRowElement.$('xpath/td[1]/div/div/div/div[2]/div[2]/span');

    if (!valueElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    if (!priceElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    if (this) {
        this.priceElement = priceElement;
        this.valueElement = valueElement;
    }

    return true;
}

export async function moneylineAway(this: localModels.Odd, {
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}): Promise<boolean> {
    if (this) {
        exchange = this.exchange;
        statistic = this.statistic;
    }

    const game = statistic.game;

    const teamRowElement = await getGameRows({
        exchange: exchange,
        statistic: statistic,
        team: game.awayTeam,
    })

    if (!teamRowElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    const priceElement = await teamRowElement.$('xpath/td[3]/div/div/div/div/div[2]/span');

    if (!priceElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    if (this) {
        this.priceElement = priceElement;
        this.valueElement = null;
    }

    return true;
}

export async function moneylineHome(this: localModels.Odd, {
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}): Promise<boolean> {
    if (this) {
        exchange = this.exchange;
        statistic = this.statistic;
    }

    const game = statistic.game;

    const teamRowElement = await getGameRows({
        exchange: exchange,
        statistic: statistic,
        team: game.homeTeam,
    })

    if (!teamRowElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    const priceElement = await teamRowElement.$('xpath/td[3]/div/div/div/div/div[2]/span');

    if (!priceElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    if (this) {
        this.priceElement = priceElement;
        this.valueElement = null;
    }

    return true;
}

export async function totalOver(this: localModels.Odd, {
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}): Promise<boolean> {
    if (this) {
        exchange = this.exchange;
        statistic = this.statistic;
    }

    const game = statistic.game;

    const teamRowElement = await getGameRows({
        exchange: exchange,
        statistic: statistic,
        team: game.awayTeam,
    });

    if (!teamRowElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    const valueElement = await teamRowElement.$('xpath/td[2]/div/div/div/div[1]/span[3]');
    const priceElement = await teamRowElement.$('xpath/td[2]/div/div/div/div[2]/div[2]/span');

    if (!valueElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    if (!priceElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    if (this) {
        this.priceElement = priceElement;
        this.valueElement = valueElement;
    }

    return true;
}

export async function totalUnder(this: localModels.Odd, {
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}): Promise<boolean> {
    if (this) {
        exchange = this.exchange;
        statistic = this.statistic;
    }

    const game = statistic.game;

    const teamRowElement = await getGameRows({
        exchange: exchange,
        statistic: statistic,
        team: game.homeTeam,
    });

    if (!teamRowElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    const valueElement = await teamRowElement.$('xpath/td[2]/div/div/div/div[1]/span[3]');
    const priceElement = await teamRowElement.$('xpath/td[2]/div/div/div/div[2]/div[2]/span');

    if (!valueElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    if (!priceElement) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    if (this) {
        this.priceElement = priceElement;
        this.valueElement = valueElement;
    }

    return true;
}

async function getGameRows({
    exchange,
    statistic,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
}): Promise<{
    awayTeamRow: ElementHandle,
    homeTeamRow: ElementHandle,
} | null> {
    const page = exchange.page;
    const game = statistic.game;

    const teamRows = await page.$$('');

}