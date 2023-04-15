"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalUnder = exports.totalOver = exports.moneylineHome = exports.moneylineAway = exports.spreadHome = exports.spreadAway = void 0;
async function spreadAway({ exchange, statistic, }) {
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
    if (!teamRowElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }
        return false;
    }
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
exports.spreadAway = spreadAway;
async function spreadHome({ exchange, statistic, }) {
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
    if (!teamRowElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }
        return false;
    }
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
exports.spreadHome = spreadHome;
async function moneylineAway({ exchange, statistic, }) {
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
    if (!teamRowElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }
        return false;
    }
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
exports.moneylineAway = moneylineAway;
async function moneylineHome({ exchange, statistic, }) {
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
    if (!teamRowElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }
        return false;
    }
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
exports.moneylineHome = moneylineHome;
async function totalOver({ exchange, statistic, }) {
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
    if (!teamRowElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }
        return false;
    }
    const valueElement = await teamRowElement.$('xpath/td[2]/div/div/div/div[1]/span[3]');
    const priceElement = await teamRowElement.$('xpath/td[2]/div/div/div/div[2]/div[2]/span');
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
exports.totalOver = totalOver;
async function totalUnder({ exchange, statistic, }) {
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
    if (!teamRowElement) {
        if (this) {
            this.setPriceElement(null);
            this.setValueElement(null);
        }
        return false;
    }
    const valueElement = await teamRowElement.$('xpath/td[2]/div/div/div/div[1]/span[3]');
    const priceElement = await teamRowElement.$('xpath/td[2]/div/div/div/div[2]/div[2]/span');
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
exports.totalUnder = totalUnder;
async function getTeamRowElement({ exchange, statistic, team, }) {
    const page = exchange.page;
    const teamRows = await page.$$('tbody > tr');
    const game = statistic.game;
    const awayTeamName = game.awayTeam.identifierFull.toLowerCase();
    const homeTeamName = game.homeTeam.identifierFull.toLowerCase();
    const matchedTeamRows = [];
    for (const teamRow of teamRows) {
        const aElement = await teamRow.$('th > a.event-cell-link');
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
        console.log(`${game.regionAbbrIdentifierAbbr} exists in ${exchange.name} JSON but not in the visible document.`);
        return null;
    }
    else if (matchedTeamRows.length > 2) {
        throw new Error(`Did not expect more than 2 game element handles for DraftKings ${game.regionAbbrIdentifierAbbr}.`);
    }
    if (team === game.awayTeam) {
        return matchedTeamRows[0];
    }
    else if (team === game.homeTeam) {
        return matchedTeamRows[1];
    }
    throw new Error(`Error finding team row element`);
}
//# sourceMappingURL=draftKings.js.map