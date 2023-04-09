// import { ElementHandle } from 'puppeteer';

// import { Odd } from '../odd';

// export async function spreadTest(this: Odd): Promise<null> {
//     return null;
// }

// export async function awaySpread(this: Odd): Promise<ElementHandle | null> {
//     const spreadAwaySpreadParent = await getParentElement({
//         odd: this,
//         selectors: [
//             this.statistic.game.awayTeam.regionFullIdentifierFull,
//             'spread betting',
//         ],
//     });

//     if (!spreadAwaySpreadParent) {
//         this.numericValueElement = null;
//         return null;
//     }

//     const spreadAwaySpreadElement = (await spreadAwaySpreadParent.$$('span'))[0];

//     const spreadAwaySpreadJson = await (await spreadAwaySpreadElement.getProperty('textContent')).jsonValue();
//     this.numericValueElement = spreadAwaySpreadElement;
//     return spreadAwaySpreadElement;
// }

// export async function awaySpreadPrice(this: Odd): Promise<ElementHandle | null> {
//     const spreadAwayPriceParent = await getParentElement({
//         odd: this,
//         selectors: [
//             this.statistic.game.awayTeam.regionFullIdentifierFull,
//             'spread betting',
//         ],
//     });

//     if (!spreadAwayPriceParent) {
//         this.priceElement = null;
//         return null;
//     }

//     const spreadAwayPriceElement = (await spreadAwayPriceParent.$$('span'))[1];

//     const spreadAwayPriceJson = await (await spreadAwayPriceElement.getProperty('textContent')).jsonValue();
//     this.priceElement = spreadAwayPriceElement;
//     return spreadAwayPriceElement;
// }

// export async function homeSpread(this: Odd): Promise<ElementHandle | null> {
//     const spreadHomeSpreadParent = await getParentElement({
//         odd: this,
//         selectors: [
//             this.statistic.game.homeTeam.regionFullIdentifierFull,
//             'spread betting',
//         ],
//     });

//     if (!spreadHomeSpreadParent) {
//         this.numericValueElement = null;
//         return null;
//     }

//     const spreadHomeSpreadElement = (await spreadHomeSpreadParent.$$('span'))[0];

//     const spreadHomeSpreadJson = await (await spreadHomeSpreadElement.getProperty('textContent')).jsonValue();
//     this.numericValueElement = spreadHomeSpreadElement;
//     return spreadHomeSpreadElement;
// }

// export async function homeSpreadPrice(this: Odd): Promise<ElementHandle | null> {
//     const spreadHomePriceParent = await getParentElement({
//         odd: this,
//         selectors: [
//             this.statistic.game.homeTeam.regionFullIdentifierFull,
//             'spread betting',
//         ],
//     });

//     if (!spreadHomePriceParent) {
//         this.priceElement = null;
//         return null;
//     }

//     const spreadHomePriceElement = (await spreadHomePriceParent.$$('span'))[1];

//     const spreadHomePriceJson = await (await spreadHomePriceElement.getProperty('textContent')).jsonValue();
//     this.priceElement = spreadHomePriceElement;
//     return spreadHomePriceElement;
// }

// export async function awayMoneyPrice(this: Odd): Promise<ElementHandle | null> {
//     const moneyAwayPriceParent = await getParentElement({
//         odd: this,
//         selectors: [
//             this.statistic.game.awayTeam.regionFullIdentifierFull,
//             'moneyline',
//         ],
//     });

//     if (!moneyAwayPriceParent) {
//         this.priceElement = null;
//         return null;
//     }

//     const moneyAwayPriceElement = await moneyAwayPriceParent.$('span');

//     if (!(moneyAwayPriceElement instanceof ElementHandle)) {
//         this.priceElement = null;
//         return null;
//     }

//     const moneyAwayPriceJson = await (await moneyAwayPriceElement.getProperty('textContent')).jsonValue();
//     this.priceElement = moneyAwayPriceElement;
//     return moneyAwayPriceElement;
// }

// export async function awayMoney(this: Odd): Promise<null> {
//     this.numericValueElement = null;
//     return null;
// }

// export async function homeMoneyPrice(this: Odd): Promise<ElementHandle | null> {
//     const moneyHomePriceParent = await getParentElement({
//         odd: this,
//         selectors: [
//             this.statistic.game.homeTeam.regionFullIdentifierFull,
//             'moneyline',
//         ],
//     });

//     if (!moneyHomePriceParent) {
//         this.priceElement = null;
//         return null;
//     }

//     const moneyHomePriceElement = await moneyHomePriceParent.$('span');

//     if (!(moneyHomePriceElement instanceof ElementHandle)) {
//         this.priceElement = null;
//         return null;
//     }

//     const moneyHomePriceJson = await (await moneyHomePriceElement.getProperty('textContent')).jsonValue();
//     this.priceElement = moneyHomePriceElement;
//     return moneyHomePriceElement;
// }

// export async function homeMoney(this: Odd): Promise<null> {
//     this.numericValueElement = null;
//     return null;
// }

// export async function overTotal(this: Odd): Promise<ElementHandle | null> {
//     const totalOverTotalParent = await getParentElement({
//         odd: this,
//         selectors: [
//             'over',
//             'total points',
//         ],
//     });

//     if (!totalOverTotalParent) {
//         this.numericValueElement = null;
//         return null;
//     }

//     const totalOverTotalElement = (await totalOverTotalParent.$$('span'))[0];

//     const totalOverTotalJson = await (await totalOverTotalElement.getProperty('textContent')).jsonValue();
//     this.numericValueElement = totalOverTotalElement;
//     return totalOverTotalElement;
// }

// export async function overTotalPrice(this: Odd): Promise<ElementHandle | null> {
//     const totalOverPriceParent = await getParentElement({
//         odd: this,
//         selectors: [
//             'over',
//             'total points',
//         ],
//     });

//     if (!totalOverPriceParent) {
//         this.priceElement = null;
//         return null;
//     }

//     const totalOverPriceElement = (await totalOverPriceParent.$$('span'))[1];

//     const totalOverPriceJson = await (await totalOverPriceElement.getProperty('textContent')).jsonValue();
//     this.priceElement = totalOverPriceElement;
//     return totalOverPriceElement;
// }

// export async function underTotal(this: Odd): Promise<ElementHandle | null> {
//     const totalUnderTotalParent = await getParentElement({
//         odd: this,
//         selectors: [
//             'under',
//             'total points',
//         ],
//     });

//     if (!totalUnderTotalParent) {
//         this.numericValueElement = null;
//         return null;
//     }

//     const totalUnderTotalElement = (await totalUnderTotalParent.$$('span'))[0];

//     const totalUnderTotalJson = await (await totalUnderTotalElement.getProperty('textContent')).jsonValue();
//     this.numericValueElement = totalUnderTotalElement;
//     return totalUnderTotalElement;
// }

// export async function underTotalPrice(this: Odd): Promise<ElementHandle | null> {
//     const totalUnderPriceParent = await getParentElement({
//         odd: this,
//         selectors: [
//             'under',
//             'total points',
//         ],
//     });

//     if (!totalUnderPriceParent) {
//         this.priceElement = null;
//         return null;
//     }

//     const totalUnderPriceElement = (await totalUnderPriceParent.$$('span'))[1];

//     const totalUnderPriceJson = await (await totalUnderPriceElement.getProperty('textContent')).jsonValue();
//     this.priceElement = totalUnderPriceElement;
//     return totalUnderPriceElement;
// }

// async function getParentElement({
//     odd,
//     selectors,
// }: {
//     odd: Odd,
//     selectors: Array<string>,
// }): Promise<ElementHandle | null> {
//     const exchange = odd.exchange;
//     const game = odd.statistic.game;
//     const page = exchange.page;

//     const gameName = game.regionFullIdentifierFull;
//     const gameTitleElements = await page.$$(`[title="${gameName}"]`);

//     if (gameTitleElements.length === 0) {
//         console.log(`${gameName} exists in ${exchange.name} JSON but not in the visible document.`);
//         return null;
//     }else if (gameTitleElements.length > 2) {
//         throw new Error(`Did not expect more than 2 game element handles for ${gameName}.`);
//     }

//     const oddElement = await (await gameTitleElements[0].getProperty('parentElement')).getProperty('parentElement');

//     if (!(oddElement instanceof ElementHandle)) {
//         return null;
//     }

//     let fullSelector = '';

//     for (const selector of selectors) {
//         fullSelector = fullSelector + `[aria-label*="${selector}" i]`
//     }

//     let parentElement = null;

//     const possibleParentElements = await oddElement.$$(fullSelector);

//     if (possibleParentElements.length < 1) {
//         return null;
//     } else if (possibleParentElements.length === 1) {
//         parentElement = possibleParentElements[0];
//     } else if (possibleParentElements.length > 1) {
//         // This deals with cases where the ARIA label incorrectly contains
//         // the selector, e.g. 'Oklahoma City Thunder' contains 'under'.

//         for (const possibleParentElement of possibleParentElements) {
//             const ariaLabel = await (await possibleParentElement.getProperty('ariaLabel')).jsonValue();

//             if (!ariaLabel) {
//                 continue;
//             }

//             let foundSelector = true;
//             let i = 0;

//             while (foundSelector && i < selectors.length) {
//                 const regex = new RegExp(`\\b${selectors[i]}\\b`, 'i');

//                 if (!regex.test(ariaLabel)) {
//                     foundSelector = false;
//                 } else {
//                     i++;
//                 }
//             }

//             if (!foundSelector) {
//                 continue;
//             }

//             parentElement = possibleParentElement;
//         }
//     }

//     if (!parentElement) {
//         return null;
//     }

//     const parentAriaLabel = await (await parentElement.getProperty('ariaLabel')).jsonValue();

//     if (!parentAriaLabel) {
//         return null;
//     }

//     if (parentAriaLabel.toLowerCase().includes('unavailable')) {
//         return null;
//     }

//     return parentElement;
// }