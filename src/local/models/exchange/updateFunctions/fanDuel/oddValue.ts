import { ElementHandle } from 'puppeteer';

import * as localModels from '../../../../../local';

export const map = new Map<string, Function>([
    ['spread_over', spreadOver],
    ['spread_under', spreadUnder],
    ['moneyline_away', moneylineAway],
    ['moneyline_home', moneylineHome],
    ['total_over', totalOver],
    ['total_under', totalUnder],
]);

export async function spreadOver(this: localModels.ContinuousOdd): Promise<void> {
    const game = this.statistic.game;

    const spreadAwayParent = await getParentElement({
        odd: this,
        selectors: [
            game.awayTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });

    if (!spreadAwayParent) {
        await this.setPrice(null);
        await this.setValue(null);
        return;
    }

    const spreadAwaySpreadElement = (await spreadAwayParent.$$('span'))[0];
    const spreadAwaySpreadJson = await (await spreadAwaySpreadElement.getProperty('textContent')).jsonValue();
    const spreadAwaySpread = Number(spreadAwaySpreadJson);

    const spreadAwayPriceElement = (await spreadAwayParent.$$('span'))[1];
    const spreadAwayPriceJson = await (await spreadAwayPriceElement.getProperty('textContent')).jsonValue();
    const spreadAwayPrice = Number(spreadAwayPriceJson);

    if (spreadAwaySpread < 0) {
        await this.setPrice(spreadAwayPrice);
        await this.setValue(Math.abs(spreadAwaySpread));
        return;
    }

    const spreadHomeParent = await getParentElement({
        odd: this,
        selectors: [
            game.homeTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });

    if (!spreadHomeParent) {
        await this.setPrice(null);
        await this.setValue(null);
        return;
    }

    const spreadHomeSpreadElement = (await spreadHomeParent.$$('span'))[0];
    const spreadHomeSpreadJson = await (await spreadHomeSpreadElement.getProperty('textContent')).jsonValue();
    const spreadHomeSpread = Number(spreadHomeSpreadJson);

    const spreadHomePriceElement = (await spreadHomeParent.$$('span'))[1];
    const spreadHomePriceJson = await (await spreadHomePriceElement.getProperty('textContent')).jsonValue();
    const spreadHomePrice = Number(spreadHomePriceJson);

    if (spreadHomeSpread < 0) {
        await this.setPrice(spreadHomePrice);
        await this.setValue(Math.abs(spreadHomeSpread));
        return;
    }
    
    await this.setPrice(null);
    await this.setValue(null);
}

export async function spreadUnder(this: localModels.ContinuousOdd) {
    const game = this.statistic.game;

    const spreadAwayParent = await getParentElement({
        odd: this,
        selectors: [
            game.awayTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });

    if (!spreadAwayParent) {
        await this.setPrice(null);
        await this.setValue(null);
        return;
    }

    const spreadAwaySpreadElement = (await spreadAwayParent.$$('span'))[0];
    const spreadAwaySpreadJson = await (await spreadAwaySpreadElement.getProperty('textContent')).jsonValue();
    const spreadAwaySpread = Number(spreadAwaySpreadJson);

    const spreadAwayPriceElement = (await spreadAwayParent.$$('span'))[1];
    const spreadAwayPriceJson = await (await spreadAwayPriceElement.getProperty('textContent')).jsonValue();
    const spreadAwayPrice = Number(spreadAwayPriceJson);

    if (spreadAwaySpread > 0) {
        await this.setPrice(spreadAwayPrice);
        await this.setValue(Math.abs(spreadAwaySpread));
        return;
    }

    const spreadHomeParent = await getParentElement({
        odd: this,
        selectors: [
            game.homeTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });

    if (!spreadHomeParent) {
        await this.setPrice(null);
        await this.setValue(null);
        return;
    }

    const spreadHomeSpreadElement = (await spreadHomeParent.$$('span'))[0];
    const spreadHomeSpreadJson = await (await spreadHomeSpreadElement.getProperty('textContent')).jsonValue();
    const spreadHomeSpread = Number(spreadHomeSpreadJson);

    const spreadHomePriceElement = (await spreadHomeParent.$$('span'))[1];
    const spreadHomePriceJson = await (await spreadHomePriceElement.getProperty('textContent')).jsonValue();
    const spreadHomePrice = Number(spreadHomePriceJson);

    if (spreadHomeSpread > 0) {
        await this.setPrice(spreadHomePrice);
        await this.setValue(Math.abs(spreadHomeSpread));
        return;
    }
    
    await this.setPrice(null);
    await this.setValue(null);
}

export async function moneylineAway(this: localModels.DiscreteOdd) {
    const game = this.statistic.game;
    
    const moneylineAwayParent = await getParentElement({
        odd: this,
        selectors: [
            game.awayTeam.regionFullIdentifierFull,
            'moneyline',
        ]
    })

    if (!moneylineAwayParent) {
        await this.setPrice(null);
        return;
    }

    const moneylineAwayPriceElement = await moneylineAwayParent.$('span');

    if (!(moneylineAwayPriceElement instanceof ElementHandle)) {
        await this.setPrice(null);
        return;
    }

    const moneylineAwayPriceJson = await (await moneylineAwayPriceElement.getProperty('textContent')).jsonValue();

    if (!moneylineAwayPriceJson) {
        await this.setPrice(null);
        return;
    }

    const moneylineAwayPrice = Number(moneylineAwayPriceJson);

    await this.setPrice(moneylineAwayPrice);
}

export async function moneylineHome(this: localModels.DiscreteOdd) {
    const game = this.statistic.game;
    
    const moneylineHomeParent = await getParentElement({
        odd: this,
        selectors: [
            game.homeTeam.regionFullIdentifierFull,
            'moneyline',
        ]
    })

    if (!moneylineHomeParent) {
        await this.setPrice(null);
        return;
    }

    const moneylineHomePriceElement = await moneylineHomeParent.$('span');

    if (!(moneylineHomePriceElement instanceof ElementHandle)) {
        await this.setPrice(null);
        return;
    }

    const moneylineHomePriceJson = await (await moneylineHomePriceElement.getProperty('textContent')).jsonValue();

    if (!moneylineHomePriceJson) {
        await this.setPrice(null);
        return;
    }

    const moneylineHomePrice = Number(moneylineHomePriceJson);

    await this.setPrice(moneylineHomePrice);
}

export async function totalOver(this: localModels.ContinuousOdd) {
    const totalOverParent = await getParentElement({
        odd: this,
        selectors: [
            'over',
            'total points',
        ],
    });

    if (!totalOverParent) {
        await this.setPrice(null);
        await this.setValue(null);
        return;
    }

    const totalOverTotalElement = (await totalOverParent.$$('span'))[0];
    const totalOverTotalJson = await (await totalOverTotalElement.getProperty('textContent')).jsonValue();

    if (!totalOverTotalJson) {
        await this.setPrice(null);
        await this.setValue(null);
        return;
    }

    const totalOverTotal = Number(totalOverTotalJson.replace(/[^0-9+\-.]/g, ''));

    const totalOverPriceElement = (await totalOverParent.$$('span'))[1];
    const totalOverPriceJson = await (await totalOverPriceElement.getProperty('textContent')).jsonValue();
    const totalOverPrice = Number(totalOverPriceJson);

    await this.setPrice(totalOverPrice);
    await this.setValue(Math.abs(totalOverTotal));
}

export async function totalUnder(this: localModels.ContinuousOdd) {
    const totalUnderParent = await getParentElement({
        odd: this,
        selectors: [
            'under',
            'total points',
        ],
    });

    if (!totalUnderParent) {
        await this.setPrice(null);
        await this.setValue(null);
        return;
    }

    const totalUnderTotalElement = (await totalUnderParent.$$('span'))[0];
    const totalUnderTotalJson = await (await totalUnderTotalElement.getProperty('textContent')).jsonValue();

    if (!totalUnderTotalJson) {
        await this.setPrice(null);
        await this.setValue(null);
        return;
    }

    const totalUnderTotal = Number(totalUnderTotalJson.replace(/[^0-9+\-.]/g, ''));

    const totalUnderPriceElement = (await totalUnderParent.$$('span'))[1];
    const totalUnderPriceJson = await (await totalUnderPriceElement.getProperty('textContent')).jsonValue();
    const totalUnderPrice = Number(totalUnderPriceJson);

    await this.setPrice(totalUnderPrice);
    await this.setValue(Math.abs(totalUnderTotal));
}

async function getParentElement({
    odd,
    selectors,
}: {
    odd: localModels.Odd,
    selectors: Array<string>,
}): Promise<ElementHandle | null> {
    const exchange = odd.exchange;
    const statistic = odd.statistic;

    const game = statistic.game;
    const page = exchange.page;

    const gameName = game.regionFullIdentifierFull;
    const gameTitleElements = await page.$$(`[title="${gameName}"]`);

    if (gameTitleElements.length === 0) {
        console.log(`${gameName} exists in ${exchange.name} JSON but not in the visible document.`);
        return null;
    }else if (gameTitleElements.length > 2) {
        throw new Error(`Did not expect more than 2 game element handles for ${gameName}.`);
    }

    const gameElement = await (await gameTitleElements[0].getProperty('parentElement')).getProperty('parentElement');

    if (!(gameElement instanceof ElementHandle)) {
        return null;
    }

    let fullSelector = '';

    for (const selector of selectors) {
        fullSelector = fullSelector + `[aria-label*="${selector}" i]`
    }

    let parentElement = null;

    const possibleParentElements = await gameElement.$$(fullSelector);

    if (possibleParentElements.length < 1) {
        return null;
    } else if (possibleParentElements.length === 1) {
        parentElement = possibleParentElements[0];
    } else if (possibleParentElements.length > 1) {
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
                } else {
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