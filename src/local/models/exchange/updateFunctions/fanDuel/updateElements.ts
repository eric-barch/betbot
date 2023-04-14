import { ElementHandle } from 'puppeteer';

import * as localModels from '../../../../../local';

export async function spreadAwayOver({
    exchange,
    statistic,
    odd,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
    odd?: localModels.Odd,
}): Promise<boolean> {
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
        if (odd) {
            odd.setPriceElement(null);
            odd.setValueElement(null);
        }

        return false;
    }

    const spreadAwayPriceElement = (await spreadAwayParent.$$('span'))[1];

    const spreadAwayValueElement = (await spreadAwayParent.$$('span'))[0];
    const spreadAwayValueJson = await (await spreadAwayValueElement.getProperty('textContent')).jsonValue();
    const spreadAwayValue = Number(spreadAwayValueJson);

    if (spreadAwayValue < 0) {
        if (odd) {
            odd.setPriceElement(spreadAwayPriceElement);
            odd.setValueElement(spreadAwayValueElement);
        }

        return true;
    }

    if (odd) {
        odd.setPriceElement(null);
        odd.setValueElement(null);
    }

    return false;
}

export async function spreadAwayUnder({
    exchange,
    statistic,
    odd,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
    odd?: localModels.Odd,
}): Promise<boolean> {
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
        if (odd) {
            odd.setPriceElement(null);
            odd.setValueElement(null);
        }

        return false;
    }

    const spreadAwayPriceElement = (await spreadAwayParent.$$('span'))[1];

    const spreadAwayValueElement = (await spreadAwayParent.$$('span'))[0];
    const spreadAwayValueJson = await (await spreadAwayValueElement.getProperty('textContent')).jsonValue();
    const spreadAwayValue = Number(spreadAwayValueJson);

    if (spreadAwayValue > 0) {
        if (odd) {
            odd.setPriceElement(spreadAwayPriceElement);
            odd.setValueElement(spreadAwayValueElement);
        }

        return true;
    }

    if (odd) {
        odd.setPriceElement(null);
        odd.setValueElement(null);
    }

    return false;
}

export async function spreadHomeOver({
    exchange,
    statistic,
    odd,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
    odd?: localModels.Odd,
}): Promise<boolean> {
    const game = statistic.game;

    const spreadHomeParent = await getParentElement({
        exchange: exchange,
        statistic: statistic,
        selectors: [
            game.homeTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });

    if (!spreadHomeParent) {
        if (odd) {
            odd.setPriceElement(null);
            odd.setValueElement(null);
        }

        return false;
    }

    const spreadHomePriceElement = (await spreadHomeParent.$$('span'))[1];

    const spreadHomeValueElement = (await spreadHomeParent.$$('span'))[0];
    const spreadHomeValueJson = await (await spreadHomeValueElement.getProperty('textContent')).jsonValue();
    const spreadHomeValue = Number(spreadHomeValueJson);

    if (spreadHomeValue < 0) {
        if (odd) {
            odd.setPriceElement(spreadHomePriceElement);
            odd.setValueElement(spreadHomeValueElement);
        }

        return true;
    }

    if (odd) {
        odd.setPriceElement(null);
        odd.setValueElement(null);
    }
    
    
    return false;
}

export async function spreadHomeUnder({
    exchange,
    statistic,
    odd,
}: {
    exchange: localModels.Exchange,
    statistic: localModels.Statistic,
    odd?: localModels.Odd,
}): Promise<boolean> {
    const game = statistic.game;

    const spreadHomeParent = await getParentElement({
        exchange: exchange,
        statistic: statistic,
        selectors: [
            game.homeTeam.regionFullIdentifierFull,
            'spread betting',
        ],
    });

    if (!spreadHomeParent) {
        if (odd) {
            odd.setPriceElement(null);
            odd.setValueElement(null);
        }

        return false;
    }

    const spreadHomePriceElement = (await spreadHomeParent.$$('span'))[1];

    const spreadHomeValueElement = (await spreadHomeParent.$$('span'))[0];
    const spreadHomeValueJson = await (await spreadHomeValueElement.getProperty('textContent')).jsonValue();
    const spreadHomeValue = Number(spreadHomeValueJson);

    if (spreadHomeValue > 0) {
        if (odd) {
            odd.setPriceElement(spreadHomePriceElement);
            odd.setValueElement(spreadHomeValueElement);
        }

        return true;
    }

    if (odd) {
        odd.setPriceElement(null);
        odd.setValueElement(null);
    }

    return false;
}

export async function moneylineAway(this: localModels.DiscreteOdd) {
    const game = this.statistic.game;
    
    const moneylineAwayParent = await getParentElement({
        exchange: this.exchange,
        statistic: this.statistic,
        selectors: [
            game.awayTeam.regionFullIdentifierFull,
            'moneyline',
        ]
    })

    if (!moneylineAwayParent) {
        this.setPriceElement(null);
        return;
    }

    const moneylineAwayPriceElement = await moneylineAwayParent.$('span');

    if (!(moneylineAwayPriceElement instanceof ElementHandle)) {
        this.setPriceElement(null);
        return;
    }

    const moneylineAwayPriceJson = await (await moneylineAwayPriceElement.getProperty('textContent')).jsonValue();

    if (!moneylineAwayPriceJson) {
        this.setPriceElement(null);
        return;
    }

    this.setPriceElement(moneylineAwayPriceElement);
}

export async function moneylineHome(this: localModels.DiscreteOdd) {
    const game = this.statistic.game;
    
    const moneylineHomeParent = await getParentElement({
        exchange: this.exchange,
        statistic: this.statistic,
        selectors: [
            game.homeTeam.regionFullIdentifierFull,
            'moneyline',
        ]
    })

    if (!moneylineHomeParent) {
        this.setPriceElement(null);
        return;
    }

    const moneylineHomePriceElement = await moneylineHomeParent.$('span');

    if (!(moneylineHomePriceElement instanceof ElementHandle)) {
        this.setPriceElement(null);
        return;
    }

    const moneylineHomePriceJson = await (await moneylineHomePriceElement.getProperty('textContent')).jsonValue();

    if (!moneylineHomePriceJson) {
        this.setPriceElement(null);
        return;
    }

    this.setPriceElement(moneylineHomePriceElement);
}

export async function totalOver(this: localModels.ContinuousOdd) {
    const totalOverParent = await getParentElement({
        exchange: this.exchange,
        statistic: this.statistic,
        selectors: [
            'over',
            'total points',
        ],
    });

    if (!totalOverParent) {
        this.setPriceElement(null);
        this.setValueElement(null);
        return;
    }

    const totalOverPriceElement = (await totalOverParent.$$('span'))[1];
    const totalOverValueElement = (await totalOverParent.$$('span'))[0];

    this.setPriceElement(totalOverPriceElement);
    this.setValueElement(totalOverValueElement);
}

export async function totalUnder(this: localModels.ContinuousOdd) {
    const totalUnderParent = await getParentElement({
        exchange: this.exchange,
        statistic: this.statistic,
        selectors: [
            'under',
            'total points',
        ],
    });

    if (!totalUnderParent) {
        this.setPriceElement(null);
        this.setValueElement(null);
        return;
    }

    const totalUnderPriceElement = (await totalUnderParent.$$('span'))[1];
    const totalUnderValueElement = (await totalUnderParent.$$('span'))[0];

    this.setPriceElement(totalUnderPriceElement);
    this.setValueElement(totalUnderValueElement);
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