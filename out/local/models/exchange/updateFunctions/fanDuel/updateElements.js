"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalUnder = exports.totalOver = exports.moneylineHome = exports.moneylineAway = exports.spreadHomeUnder = exports.spreadHomeOver = exports.spreadAwayUnder = exports.spreadAwayOver = void 0;
const puppeteer_1 = require("puppeteer");
async function spreadAwayOver() {
    const game = this.statistic.game;
    const spreadAwayParent = await getParentElement({
        odd: this,
        selectors: [
            game.awayTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });
    if (!spreadAwayParent) {
        await this.setPriceElement(null);
        await this.setValueElement(null);
        return;
    }
    const spreadAwayPriceElement = (await spreadAwayParent.$$('span'))[1];
    const spreadAwayValueElement = (await spreadAwayParent.$$('span'))[0];
    const spreadAwayValueJson = await (await spreadAwayValueElement.getProperty('textContent')).jsonValue();
    const spreadAwayValue = Number(spreadAwayValueJson);
    if (spreadAwayValue < 0) {
        await this.setPriceElement(spreadAwayPriceElement);
        await this.setValueElement(spreadAwayValueElement);
        return;
    }
    await this.setPriceElement(null);
    await this.setValueElement(null);
}
exports.spreadAwayOver = spreadAwayOver;
async function spreadAwayUnder() {
    const game = this.statistic.game;
    const spreadAwayParent = await getParentElement({
        odd: this,
        selectors: [
            game.awayTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });
    if (!spreadAwayParent) {
        await this.setPriceElement(null);
        await this.setValueElement(null);
        return;
    }
    const spreadAwayPriceElement = (await spreadAwayParent.$$('span'))[1];
    const spreadAwayValueElement = (await spreadAwayParent.$$('span'))[0];
    const spreadAwayValueJson = await (await spreadAwayValueElement.getProperty('textContent')).jsonValue();
    const spreadAwayValue = Number(spreadAwayValueJson);
    if (spreadAwayValue > 0) {
        await this.setPriceElement(spreadAwayPriceElement);
        await this.setValueElement(spreadAwayValueElement);
        return;
    }
    await this.setPriceElement(null);
    await this.setValueElement(null);
}
exports.spreadAwayUnder = spreadAwayUnder;
async function spreadHomeOver() {
    const game = this.statistic.game;
    const spreadHomeParent = await getParentElement({
        odd: this,
        selectors: [
            game.homeTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });
    if (!spreadHomeParent) {
        await this.setPriceElement(null);
        await this.setValueElement(null);
        return;
    }
    const spreadHomePriceElement = (await spreadHomeParent.$$('span'))[1];
    const spreadHomeValueElement = (await spreadHomeParent.$$('span'))[0];
    const spreadHomeValueJson = await (await spreadHomeValueElement.getProperty('textContent')).jsonValue();
    const spreadHomeValue = Number(spreadHomeValueJson);
    if (spreadHomeValue < 0) {
        await this.setPriceElement(spreadHomePriceElement);
        await this.setValueElement(spreadHomeValueElement);
        return;
    }
    await this.setPriceElement(null);
    await this.setValueElement(null);
}
exports.spreadHomeOver = spreadHomeOver;
async function spreadHomeUnder() {
    const game = this.statistic.game;
    const spreadHomeParent = await getParentElement({
        odd: this,
        selectors: [
            game.homeTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });
    if (!spreadHomeParent) {
        await this.setPriceElement(null);
        await this.setValueElement(null);
        return;
    }
    const spreadHomePriceElement = (await spreadHomeParent.$$('span'))[1];
    const spreadHomeValueElement = (await spreadHomeParent.$$('span'))[0];
    const spreadHomeValueJson = await (await spreadHomeValueElement.getProperty('textContent')).jsonValue();
    const spreadHomeValue = Number(spreadHomeValueJson);
    if (spreadHomeValue > 0) {
        await this.setPriceElement(spreadHomePriceElement);
        await this.setValueElement(spreadHomeValueElement);
        return;
    }
    await this.setPriceElement(null);
    await this.setValueElement(null);
}
exports.spreadHomeUnder = spreadHomeUnder;
async function moneylineAway() {
    const game = this.statistic.game;
    const moneylineAwayParent = await getParentElement({
        odd: this,
        selectors: [
            game.awayTeam.regionFullIdentifierFull,
            'moneyline',
        ]
    });
    if (!moneylineAwayParent) {
        await this.setPriceElement(null);
        return;
    }
    const moneylineAwayPriceElement = await moneylineAwayParent.$('span');
    if (!(moneylineAwayPriceElement instanceof puppeteer_1.ElementHandle)) {
        await this.setPriceElement(null);
        return;
    }
    const moneylineAwayPriceJson = await (await moneylineAwayPriceElement.getProperty('textContent')).jsonValue();
    if (!moneylineAwayPriceJson) {
        await this.setPriceElement(null);
        return;
    }
    await this.setPriceElement(moneylineAwayPriceElement);
}
exports.moneylineAway = moneylineAway;
async function moneylineHome() {
    const game = this.statistic.game;
    const moneylineHomeParent = await getParentElement({
        odd: this,
        selectors: [
            game.homeTeam.regionFullIdentifierFull,
            'moneyline',
        ]
    });
    if (!moneylineHomeParent) {
        await this.setPriceElement(null);
        return;
    }
    const moneylineHomePriceElement = await moneylineHomeParent.$('span');
    if (!(moneylineHomePriceElement instanceof puppeteer_1.ElementHandle)) {
        await this.setPriceElement(null);
        return;
    }
    const moneylineHomePriceJson = await (await moneylineHomePriceElement.getProperty('textContent')).jsonValue();
    if (!moneylineHomePriceJson) {
        await this.setPriceElement(null);
        return;
    }
    await this.setPriceElement(moneylineHomePriceElement);
}
exports.moneylineHome = moneylineHome;
async function totalOver() {
    const totalOverParent = await getParentElement({
        odd: this,
        selectors: [
            'over',
            'total points',
        ],
    });
    if (!totalOverParent) {
        await this.setPriceElement(null);
        await this.setValueElement(null);
        return;
    }
    const totalOverPriceElement = (await totalOverParent.$$('span'))[1];
    const totalOverValueElement = (await totalOverParent.$$('span'))[0];
    await this.setPriceElement(totalOverPriceElement);
    await this.setValueElement(totalOverValueElement);
}
exports.totalOver = totalOver;
async function totalUnder() {
    const totalUnderParent = await getParentElement({
        odd: this,
        selectors: [
            'under',
            'total points',
        ],
    });
    if (!totalUnderParent) {
        await this.setPriceElement(null);
        await this.setValueElement(null);
        return;
    }
    const totalUnderPriceElement = (await totalUnderParent.$$('span'))[1];
    const totalUnderValueElement = (await totalUnderParent.$$('span'))[0];
    await this.setPriceElement(totalUnderPriceElement);
    await this.setValueElement(totalUnderValueElement);
}
exports.totalUnder = totalUnder;
async function getParentElement({ odd, selectors, }) {
    const exchange = odd.exchange;
    const statistic = odd.statistic;
    const game = statistic.game;
    const page = exchange.page;
    const gameName = game.regionFullIdentifierFull;
    const gameTitleElements = await page.$$(`[title="${gameName}"]`);
    if (gameTitleElements.length === 0) {
        console.log(`${gameName} exists in ${exchange.name} JSON but not in the visible document.`);
        return null;
    }
    else if (gameTitleElements.length > 2) {
        throw new Error(`Did not expect more than 2 game element handles for ${gameName}.`);
    }
    const gameElement = await (await gameTitleElements[0].getProperty('parentElement')).getProperty('parentElement');
    if (!(gameElement instanceof puppeteer_1.ElementHandle)) {
        return null;
    }
    let fullSelector = '';
    for (const selector of selectors) {
        fullSelector = fullSelector + `[aria-label*="${selector}" i]`;
    }
    let parentElement = null;
    const possibleParentElements = await gameElement.$$(fullSelector);
    if (possibleParentElements.length < 1) {
        return null;
    }
    else if (possibleParentElements.length === 1) {
        parentElement = possibleParentElements[0];
    }
    else if (possibleParentElements.length > 1) {
        // This deals with cases where the ARIA label incorrectly contains
        // the selector, e.g. 'Oklahoma City Thunder' contains 'under'.
        for (const possibleParentElement of possibleParentElements) {
            const ariaLabel = await (await possibleParentElement.getProperty('ariaLabel')).jsonValue();
            if (!ariaLabel) {
                continue;
            }
            let foundSelector = true;
            let i = 0;
            while (foundSelector && i < selectors.length) {
                const regex = new RegExp(`\\b${selectors[i]}\\b`, 'i');
                if (!regex.test(ariaLabel)) {
                    foundSelector = false;
                }
                else {
                    i++;
                }
            }
            if (!foundSelector) {
                continue;
            }
            parentElement = possibleParentElement;
        }
    }
    if (!parentElement) {
        return null;
    }
    const parentAriaLabel = await (await parentElement.getProperty('ariaLabel')).jsonValue();
    if (!parentAriaLabel) {
        return null;
    }
    if (parentAriaLabel.toLowerCase().includes('unavailable')) {
        return null;
    }
    return parentElement;
}
//# sourceMappingURL=updateElements.js.map