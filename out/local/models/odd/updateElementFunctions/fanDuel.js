"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.underTotalPrice = exports.underTotal = exports.overTotalPrice = exports.overTotal = exports.totalOdd = exports.homeMoneyPrice = exports.awayMoneyPrice = exports.moneyOdd = exports.homeSpreadPrice = exports.homeSpread = exports.awaySpreadPrice = exports.awaySpread = exports.spreadOdd = exports.odd = void 0;
const puppeteer_1 = require("puppeteer");
async function odd() {
    const exchange = this.exchange;
    const game = this.game;
    const page = exchange.page;
    const gameName = game.regionFullIdentifierFull;
    const gameTitleElements = await page.$$(`[title="${gameName}"]`);
    if (gameTitleElements.length === 0) {
        console.log(`${gameName} exists in ${exchange.name} JSON but not in the visible document.`);
        this.element = null;
        return null;
    }
    else if (gameTitleElements.length > 2) {
        throw new Error(`Did not expect more than 2 game element handles for ${gameName}.`);
    }
    const oddElement = await (await gameTitleElements[0].getProperty('parentElement')).getProperty('parentElement');
    if (!(oddElement instanceof puppeteer_1.ElementHandle)) {
        this.element = null;
        return null;
    }
    this.element = oddElement;
    return oddElement;
}
exports.odd = odd;
async function spreadOdd() {
    this.element = null;
    return null;
}
exports.spreadOdd = spreadOdd;
async function awaySpread() {
    const spreadAwaySpreadParent = await getParentElement({
        element: this,
        selectors: [
            this.game.awayTeam.name,
            'spread betting',
        ],
    });
    if (!spreadAwaySpreadParent) {
        this.element = null;
        return null;
    }
    const spreadAwaySpreadElement = (await spreadAwaySpreadParent.$$('span'))[0];
    const spreadAwaySpreadJson = await (await spreadAwaySpreadElement.getProperty('textContent')).jsonValue();
    this.element = spreadAwaySpreadElement;
    return spreadAwaySpreadElement;
}
exports.awaySpread = awaySpread;
async function awaySpreadPrice() {
    const spreadAwayPriceParent = await getParentElement({
        element: this,
        selectors: [
            this.game.awayTeam.name,
            'spread betting',
        ],
    });
    if (!spreadAwayPriceParent) {
        this.element = null;
        return null;
    }
    const spreadAwayPriceElement = (await spreadAwayPriceParent.$$('span'))[1];
    const spreadAwayPriceJson = await (await spreadAwayPriceElement.getProperty('textContent')).jsonValue();
    this.element = spreadAwayPriceElement;
    return spreadAwayPriceElement;
}
exports.awaySpreadPrice = awaySpreadPrice;
async function homeSpread() {
    const spreadHomeSpreadParent = await getParentElement({
        element: this,
        selectors: [
            this.game.homeTeam.name,
            'spread betting',
        ],
    });
    if (!spreadHomeSpreadParent) {
        this.element = null;
        return null;
    }
    const spreadHomeSpreadElement = (await spreadHomeSpreadParent.$$('span'))[0];
    const spreadHomeSpreadJson = await (await spreadHomeSpreadElement.getProperty('textContent')).jsonValue();
    this.element = spreadHomeSpreadElement;
    return spreadHomeSpreadElement;
}
exports.homeSpread = homeSpread;
async function homeSpreadPrice() {
    const spreadHomePriceParent = await getParentElement({
        element: this,
        selectors: [
            this.game.homeTeam.name,
            'spread betting',
        ],
    });
    if (!spreadHomePriceParent) {
        this.element = null;
        return null;
    }
    const spreadHomePriceElement = (await spreadHomePriceParent.$$('span'))[1];
    const spreadHomePriceJson = await (await spreadHomePriceElement.getProperty('textContent')).jsonValue();
    this.element = spreadHomePriceElement;
    return spreadHomePriceElement;
}
exports.homeSpreadPrice = homeSpreadPrice;
async function moneyOdd() {
    this.element = null;
    return null;
}
exports.moneyOdd = moneyOdd;
async function awayMoneyPrice() {
    const moneyAwayPriceParent = await getParentElement({
        element: this,
        selectors: [
            this.game.awayTeam.name,
            'moneyline',
        ],
    });
    if (!moneyAwayPriceParent) {
        this.element = null;
        return null;
    }
    const moneyAwayPriceElement = await moneyAwayPriceParent.$('span');
    if (!(moneyAwayPriceElement instanceof puppeteer_1.ElementHandle)) {
        this.element = null;
        return null;
    }
    const moneyAwayPriceJson = await (await moneyAwayPriceElement.getProperty('textContent')).jsonValue();
    this.element = moneyAwayPriceElement;
    return moneyAwayPriceElement;
}
exports.awayMoneyPrice = awayMoneyPrice;
async function homeMoneyPrice() {
    const moneyHomePriceParent = await getParentElement({
        element: this,
        selectors: [
            this.game.homeTeam.name,
            'moneyline',
        ],
    });
    if (!moneyHomePriceParent) {
        this.element = null;
        return null;
    }
    const moneyHomePriceElement = await moneyHomePriceParent.$('span');
    if (!(moneyHomePriceElement instanceof puppeteer_1.ElementHandle)) {
        this.element = null;
        return null;
    }
    const moneyHomePriceJson = await (await moneyHomePriceElement.getProperty('textContent')).jsonValue();
    this.element = moneyHomePriceElement;
    return moneyHomePriceElement;
}
exports.homeMoneyPrice = homeMoneyPrice;
async function totalOdd() {
    this.element = null;
    return null;
}
exports.totalOdd = totalOdd;
async function overTotal() {
    const totalOverTotalParent = await getParentElement({
        element: this,
        selectors: [
            'over',
            'total points',
        ],
    });
    if (!totalOverTotalParent) {
        this.element = null;
        return null;
    }
    const totalOverTotalElement = (await totalOverTotalParent.$$('span'))[0];
    const totalOverTotalJson = await (await totalOverTotalElement.getProperty('textContent')).jsonValue();
    this.element = totalOverTotalElement;
    return totalOverTotalElement;
}
exports.overTotal = overTotal;
async function overTotalPrice() {
    const totalOverPriceParent = await getParentElement({
        element: this,
        selectors: [
            'over',
            'total points',
        ],
    });
    if (!totalOverPriceParent) {
        this.element = null;
        return null;
    }
    const totalOverPriceElement = (await totalOverPriceParent.$$('span'))[1];
    const totalOverPriceJson = await (await totalOverPriceElement.getProperty('textContent')).jsonValue();
    this.element = totalOverPriceElement;
    return totalOverPriceElement;
}
exports.overTotalPrice = overTotalPrice;
async function underTotal() {
    const totalUnderTotalParent = await getParentElement({
        element: this,
        selectors: [
            'under',
            'total points',
        ],
    });
    if (!totalUnderTotalParent) {
        this.element = null;
        return null;
    }
    const totalUnderTotalElement = (await totalUnderTotalParent.$$('span'))[0];
    const totalUnderTotalJson = await (await totalUnderTotalElement.getProperty('textContent')).jsonValue();
    this.element = totalUnderTotalElement;
    return totalUnderTotalElement;
}
exports.underTotal = underTotal;
async function underTotalPrice() {
    const totalUnderPriceParent = await getParentElement({
        element: this,
        selectors: [
            'under',
            'total points',
        ],
    });
    if (!totalUnderPriceParent) {
        this.element = null;
        return null;
    }
    const totalUnderPriceElement = (await totalUnderPriceParent.$$('span'))[1];
    const totalUnderPriceJson = await (await totalUnderPriceElement.getProperty('textContent')).jsonValue();
    this.element = totalUnderPriceElement;
    return totalUnderPriceElement;
}
exports.underTotalPrice = underTotalPrice;
async function getParentElement({ element, selectors, }) {
    const oddElement = await element.odd.element;
    if (!oddElement) {
        return null;
    }
    let fullSelector = '';
    for (const selector of selectors) {
        fullSelector = fullSelector + `[aria-label*="${selector}" i]`;
    }
    let parentElement = null;
    const possibleParentElements = await oddElement.$$(fullSelector);
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
//# sourceMappingURL=fanDuel.js.map