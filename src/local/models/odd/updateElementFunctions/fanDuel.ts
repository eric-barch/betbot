import { ElementHandle } from 'puppeteer';

import { ElementWrapper, ElementWrapperWithValue, MoneyOdd, Odd, SpreadOdd, TotalOdd } from '../odd';

export async function odd(this: Odd) {
    const exchange = this.exchange;
    const game = this.game;
    const page = exchange.page;

    const gameName = game.regionFullIdentifierFull;
    const gameTitleElements = await page.$$(`[title="${gameName}"]`);

    if (gameTitleElements.length === 0) {
        console.log(`${gameName} exists in ${exchange.name} JSON but not in the visible document.`);
        this.element = null;
        return;
    }else if (gameTitleElements.length > 2) {
        throw new Error(`Did not expect more than 2 game element handles for ${gameName}.`);
    }

    const oddElement = await (await gameTitleElements[0].getProperty('parentElement')).getProperty('parentElement');

    if (oddElement instanceof ElementHandle) {
        this.element = oddElement;
    } else {
        this.element = null;
    }
}

export async function spreadOdd(this: SpreadOdd) {
    this.element = null;
}

export async function awaySpread(this: ElementWrapperWithValue) {
    const spreadAwaySpreadParent = await getParentElement({
        element: this,
        selectors: [
            this.game.awayTeam.name,
            'spread betting',
        ],
    });

    if (!spreadAwaySpreadParent) {
        this.element = null;
        return;
    }

    const spreadAwaySpreadElement = (await spreadAwaySpreadParent.$$('span'))[0];

    const spreadAwaySpreadJson = await (await spreadAwaySpreadElement.getProperty('textContent')).jsonValue();
    this.element = spreadAwaySpreadElement;
}

export async function awaySpreadPrice(this: ElementWrapperWithValue) {
    const spreadAwayPriceParent = await getParentElement({
        element: this,
        selectors: [
            this.game.awayTeam.name,
            'spread betting',
        ],
    });

    if (!spreadAwayPriceParent) {
        this.element = null;
        return;
    }

    const spreadAwayPriceElement = (await spreadAwayPriceParent.$$('span'))[1];

    const spreadAwayPriceJson = await (await spreadAwayPriceElement.getProperty('textContent')).jsonValue();
    this.element = spreadAwayPriceElement;
}

export async function homeSpread(this: ElementWrapperWithValue) {
    const spreadHomeSpreadParent = await getParentElement({
        element: this,
        selectors: [
            this.game.homeTeam.name,
            'spread betting',
        ],
    });

    if (!spreadHomeSpreadParent) {
        this.element = null;
        return;
    }

    const spreadHomeSpreadElement = (await spreadHomeSpreadParent.$$('span'))[0];

    const spreadHomeSpreadJson = await (await spreadHomeSpreadElement.getProperty('textContent')).jsonValue();
    this.element = spreadHomeSpreadElement;
}

export async function homeSpreadPrice(this: ElementWrapperWithValue) {
    const spreadHomePriceParent = await getParentElement({
        element: this,
        selectors: [
            this.game.homeTeam.name,
            'spread betting',
        ],
    });

    if (!spreadHomePriceParent) {
        this.element = null;
        return;
    }

    const spreadHomePriceElement = (await spreadHomePriceParent.$$('span'))[1];

    const spreadHomePriceJson = await (await spreadHomePriceElement.getProperty('textContent')).jsonValue();
    this.element = spreadHomePriceElement;
}

export async function moneyOdd(this: MoneyOdd) {
    this.element = null;
}

export async function awayMoneyPrice(this: ElementWrapperWithValue) {
    const moneyAwayPriceParent = await getParentElement({
        element: this,
        selectors: [
            this.game.awayTeam.name,
            'moneyline',
        ],
    });

    if (!moneyAwayPriceParent) {
        this.element = null;
        return;
    }

    const moneyAwayPriceElement = await moneyAwayPriceParent.$('span');

    if (!(moneyAwayPriceElement instanceof ElementHandle)) {
        this.element = null;
        return;
    }

    const moneyAwayPriceJson = await (await moneyAwayPriceElement.getProperty('textContent')).jsonValue();
    this.element = moneyAwayPriceElement;
}

export async function homeMoneyPrice(this: ElementWrapperWithValue) {
    const moneyHomePriceParent = await getParentElement({
        element: this,
        selectors: [
            this.game.homeTeam.name,
            'moneyline',
        ],
    });

    if (!moneyHomePriceParent) {
        this.element = null;
        return;
    }

    const moneyHomePriceElement = await moneyHomePriceParent.$('span');

    if (!(moneyHomePriceElement instanceof ElementHandle)) {
        this.element = null;
        return;
    }

    const moneyHomePriceJson = await (await moneyHomePriceElement.getProperty('textContent')).jsonValue();
    this.element = moneyHomePriceElement;
}

export async function totalOdd(this: TotalOdd) {
    this.element = null;
}

export async function overTotal(this: ElementWrapperWithValue) {
    const totalOverTotalParent = await getParentElement({
        element: this,
        selectors: [
            'over',
            'total points',
        ],
    });

    if (!totalOverTotalParent) {
        this.element = null;
        return;
    }

    const totalOverTotalElement = (await totalOverTotalParent.$$('span'))[0];

    const totalOverTotalJson = await (await totalOverTotalElement.getProperty('textContent')).jsonValue();
    this.element = totalOverTotalElement;
}

export async function overTotalPrice(this: ElementWrapperWithValue) {
    const totalOverPriceParent = await getParentElement({
        element: this,
        selectors: [
            'over',
            'total points',
        ],
    });

    if (!totalOverPriceParent) {
        this.element = null;
        return;
    }

    const totalOverPriceElement = (await totalOverPriceParent.$$('span'))[1];

    const totalOverPriceJson = await (await totalOverPriceElement.getProperty('textContent')).jsonValue();
    this.element = totalOverPriceElement;
}

export async function underTotal(this: ElementWrapperWithValue) {
    const totalUnderTotalParent = await getParentElement({
        element: this,
        selectors: [
            'under',
            'total points',
        ],
    });

    if (!totalUnderTotalParent) {
        this.element = null;
        return;
    }

    const totalUnderTotalElement = (await totalUnderTotalParent.$$('span'))[0];

    const totalUnderTotalJson = await (await totalUnderTotalElement.getProperty('textContent')).jsonValue();
    this.element = totalUnderTotalElement;
}

export async function underTotalPrice(this: ElementWrapperWithValue) {
    const totalUnderPriceParent = await getParentElement({
        element: this,
        selectors: [
            'under',
            'total points',
        ],
    });

    if (!totalUnderPriceParent) {
        this.element = null;
        return;
    }

    const totalUnderPriceElement = (await totalUnderPriceParent.$$('span'))[1];

    const totalUnderPriceJson = await (await totalUnderPriceElement.getProperty('textContent')).jsonValue();
    this.element = totalUnderPriceElement;
}

async function getParentElement({
    element,
    selectors,
}: {
    element: ElementWrapper,
    selectors: Array<string>,
}) {
    const oddElement = await element.parent.parent.element;

    if (!oddElement) {
        return null;
    }

    let fullSelector = '';

    for (const selector of selectors) {
        fullSelector = fullSelector + `[aria-label*="${selector}" i]`
    }

    let parentElement = null;

    const possibleParentElements = await oddElement.$$(fullSelector);

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