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

    const spreadAwayParent = await getParentElement({
        exchange: exchange,
        statistic: statistic,
        selectors: [
            game.awayTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });

    if (!spreadAwayParent) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    const spreadAwayValueElement = (await spreadAwayParent.$$('span'))[0];
    const spreadAwayPriceElement = (await spreadAwayParent.$$('span'))[1];

    if (this) {
        this.priceElement = spreadAwayPriceElement;
        this.valueElement = spreadAwayValueElement;
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

    const spreadAwayParent = await getParentElement({
        exchange: exchange,
        statistic: statistic,
        selectors: [
            game.homeTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });

    if (!spreadAwayParent) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    const spreadAwayValueElement = (await spreadAwayParent.$$('span'))[0];
    const spreadAwayPriceElement = (await spreadAwayParent.$$('span'))[1];

    if (this) {
        this.priceElement = spreadAwayPriceElement;
        this.valueElement = spreadAwayValueElement;
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
    
    const moneylineAwayParent = await getParentElement({
        exchange: exchange,
        statistic: statistic,
        selectors: [
            game.awayTeam.regionFullIdentifierFull,
            'moneyline',
        ]
    })

    if (!moneylineAwayParent) {
        if (this) {
            this.priceElement = null;
        }

        return false;
    }

    const moneylineAwayPriceElement = await moneylineAwayParent.$('span');

    if (!(moneylineAwayPriceElement instanceof ElementHandle)) {
        if (this) {
            this.priceElement = null;
        }

        return false;
    }

    const moneylineAwayPriceJson = await (await moneylineAwayPriceElement.getProperty('textContent')).jsonValue();

    if (!moneylineAwayPriceJson) {
        if (this) {
            this.priceElement = null;
        }

        return false;
    }

    if (this) {
        this.priceElement = moneylineAwayPriceElement;
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
    
    const moneylineHomeParent = await getParentElement({
        exchange: exchange,
        statistic: statistic,
        selectors: [
            game.homeTeam.regionFullIdentifierFull,
            'moneyline',
        ]
    })

    if (!moneylineHomeParent) {
        if (this) {
            this.priceElement = null;
        }

        return false;
    }

    const moneylineHomePriceElement = await moneylineHomeParent.$('span');

    if (!(moneylineHomePriceElement instanceof ElementHandle)) {
        if (this) {
            this.priceElement = null;
        }

        return false;
    }

    const moneylineHomePriceJson = await (await moneylineHomePriceElement.getProperty('textContent')).jsonValue();

    if (!moneylineHomePriceJson) {
        if (this) {
            this.priceElement = null;
        }

        return false;
    }

    if (this) {
        this.priceElement = moneylineHomePriceElement;
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

    const totalOverParent = await getParentElement({
        exchange: exchange,
        statistic: statistic,
        selectors: [
            'over',
            'total points',
        ],
    });

    if (!totalOverParent) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    const totalOverPriceElement = (await totalOverParent.$$('span'))[1];
    const totalOverValueElement = (await totalOverParent.$$('span'))[0];

    if (this) {
        this.priceElement = totalOverPriceElement;
        this.valueElement = totalOverValueElement;
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

    const totalUnderParent = await getParentElement({
        exchange: exchange,
        statistic: statistic,
        selectors: [
            'under',
            'total points',
        ],
    });

    if (!totalUnderParent) {
        if (this) {
            this.priceElement = null;
            this.valueElement = null;
        }

        return false;
    }

    const totalUnderPriceElement = (await totalUnderParent.$$('span'))[1];
    const totalUnderValueElement = (await totalUnderParent.$$('span'))[0];

    if (this) {
        this.priceElement = totalUnderPriceElement;
        this.valueElement = totalUnderValueElement;
    }
    
    return true;
}

async function getParentElement({
    exchange,
    statistic,
    selectors,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
    selectors: Array<string>,
}): Promise<ElementHandle | null> {
    const game = statistic.game;
    const page = exchange.page;

    const gameName = game.regionFullIdentifierFull;
    const gameTitleElements = await page.$$(`[title="${gameName}"]`);

    if (gameTitleElements.length === 0) {
        console.log(`${gameName} exists in ${exchange.name} JSON but not in the visible document.`);
        return null;
    }else if (gameTitleElements.length > 2) {
        throw new Error(`Did not expect more than 2 game element handles for FanDuel ${gameName}.`);
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