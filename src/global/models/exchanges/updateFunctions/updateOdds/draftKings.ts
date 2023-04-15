import { ElementHandle } from 'puppeteer';

import * as localModels from '../../../../../local';

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

    const teamRowElement = await getTeamRowElement({
        exchange: exchange,
        statistic: statistic,
        team: game.awayTeam,
    });

    const valueElement = await teamRowElement.$('xpath/td[1]/div/div/div/div[1]/span');
    const priceElement = await teamRowElement.$('xpath/td[1]/div/div/div/div[2]/div[2]/span');

    if (!valueElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }

        return false;
    }

    if (!priceElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }

        return false;
    }

    if (this) {
        this.setPriceElement(priceElement);
        this.setValueElement(valueElement);
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

    const teamRowElement = await getTeamRowElement({
        exchange: exchange,
        statistic: statistic,
        team: game.homeTeam,
    });

    const valueElement = await teamRowElement.$('xpath/td[1]/div/div/div/div[1]/span');
    const priceElement = await teamRowElement.$('xpath/td[1]/div/div/div/div[2]/div[2]/span');

    if (!valueElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }

        return false;
    }

    if (!priceElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }

        return false;
    }

    if (this) {
        this.setPriceElement(priceElement);
        this.setValueElement(valueElement);
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

    const teamRowElement = await getTeamRowElement({
        exchange: exchange,
        statistic: statistic,
        team: game.awayTeam,
    })

    const priceElement = await teamRowElement.$('xpath/td[3]/div/div/div/div/div[2]/span');

    if (!priceElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }

        return false;
    }

    if (this) {
        this.setPriceElement(priceElement);
        this.setValueElement(null);
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

    const teamRowElement = await getTeamRowElement({
        exchange: exchange,
        statistic: statistic,
        team: game.homeTeam,
    })

    const priceElement = await teamRowElement.$('xpath/td[3]/div/div/div/div/div[2]/span');

    if (!priceElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }

        return false;
    }

    if (this) {
        this.setPriceElement(priceElement);
        this.setValueElement(null);
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

    return false;
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

    return false;
}

async function getTeamRowElement({
    exchange,
    statistic,
    team,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
    team: localModels.Team,
}): Promise<ElementHandle> {
    const page = exchange.page;

    const teamRows = await page.$$('tbody > tr');

    const game = statistic.game;
    const awayTeamName = game.awayTeam.identifierFull.toLowerCase();
    const homeTeamName = game.homeTeam.identifierFull.toLowerCase();

    const matchedTeamRows = [];

    for (const teamRow of teamRows) {
        const aElement = await teamRow.$('th > a');

        if (!aElement) {
            continue;
        }

        const hrefString = await (await aElement.getProperty('href')).jsonValue();
        const hrefStringClean = hrefString.trim().toLowerCase();

        if (hrefStringClean.includes(awayTeamName) && hrefStringClean.includes(homeTeamName)) {
            matchedTeamRows.push(teamRow);
        }
    }

    if (matchedTeamRows.length < 2) {
        throw new Error(`Did not expect fewer than 2 game element handles from ${game.regionAbbrIdentifierAbbr}`);
    }else if (matchedTeamRows.length > 2) {
        throw new Error(`Did not expect more than 2 game element handles for ${game.regionAbbrIdentifierAbbr}.`);
    }

    if (team === game.awayTeam) {
        return matchedTeamRows[0];
    } else if (team === game.homeTeam) {
        return matchedTeamRows[1];
    }

    throw new Error(`Error finding team row element`);
}