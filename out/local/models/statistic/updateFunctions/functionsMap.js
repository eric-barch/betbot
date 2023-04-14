"use strict";
// import * as localModels from '../../..';
// export const updateFunctionsMap = new Map<string, Function>([
//     ['spread_away', spreadAway],
//     ['spread_home', spreadHome],
//     ['moneyline', moneyline],
//     ['total', total],
// ]);
// export async function spreadAway({
//     exchange,
//     statistic,
// }: {
//     exchange: localModels.Exchange,
//     statistic: localModels.Statistic,
// }) {
//     const exchangeUpdateFunctionsMap = exchange.updateFunctionsMap;
//     const overKey = `${statistic.name}_over`;
//     const overUpdateElementFunction = exchangeUpdateFunctionsMap.get(overKey);
//     if (!overUpdateElementFunction) {
//         throw new Error(`Did not find spreadAwayOver element function.`);
//     }
//     const spreadAwayOverOddExists = await overUpdateElementFunction({
//         exchange: exchange,
//         statistic: statistic,
//     });
//     if (spreadAwayOverOddExists) {
//         await statistic.oddSet.findOrCreate({
//             exchange: exchange,
//             statistic: statistic,
//             inequality: localModels.Inequality.Over,
//             updateElementsFunction: overUpdateElementFunction,
//         });
//     }
//     const underKey = `${statistic.name}_under`;
//     const underUpdateElementFunction = exchangeUpdateFunctionsMap.get(underKey);
//     if (!underUpdateElementFunction) {
//         throw new Error(`Did not find spreadAwayUnder function.`);
//     }
//     const spreadAwayUnderOddExists = await underUpdateElementFunction({
//         exchange: exchange,
//         statistic: statistic,
//     })
//     if (spreadAwayUnderOddExists) {
//         await statistic.oddSet.findOrCreate({
//             exchange: exchange,
//             statistic: statistic,
//             inequality: localModels.Inequality.Under,
//             updateElementsFunction: underUpdateElementFunction,
//         });
//     }
// }
// export async function spreadHome({
//     exchange,
//     statistic,
// }: {
//     exchange: localModels.Exchange,
//     statistic: localModels.Statistic,
// }) {
//     const exchangeUpdateFunctionsMap = exchange.updateFunctionsMap;
//     const overKey = `${statistic.name}_over`;
//     const overUpdateElementFunction = exchangeUpdateFunctionsMap.get(overKey);
//     if (!overUpdateElementFunction) {
//         throw new Error(`Did not find spreadHomeOver element function.`);
//     }
//     const spreadHomeOverOddExists = await overUpdateElementFunction({
//         exchange: exchange,
//         statistic: statistic,
//     });
//     if (spreadHomeOverOddExists) {
//         await statistic.oddSet.findOrCreate({
//             exchange: exchange,
//             statistic: statistic,
//             inequality: localModels.Inequality.Over,
//             updateElementsFunction: overUpdateElementFunction,
//         });
//     }
//     const underKey = `${statistic.name}_under`;
//     const underUpdateElementFunction = exchangeUpdateFunctionsMap.get(underKey);
//     if (!underUpdateElementFunction) {
//         throw new Error(`Did not find spreadHomeUnder function.`);
//     }
//     const spreadHomeUnderOddExists = await underUpdateElementFunction({
//         exchange: exchange,
//         statistic: statistic,
//     })
//     if (spreadHomeUnderOddExists) {
//         await statistic.oddSet.findOrCreate({
//             exchange: exchange,
//             statistic: statistic,
//             inequality: localModels.Inequality.Under,
//             updateElementsFunction: underUpdateElementFunction,
//         });
//     }
// }
// export async function moneyline({
//     exchange,
//     statistic,
// }: {
//     exchange: localModels.Exchange,
//     statistic: localModels.Statistic,
// }) {
//     const exchangeUpdateFunctionsMap = exchange.updateFunctionsMap;
//     const awayKey = `${statistic.name}_away`;
//     const awayUpdateElementFunction = exchangeUpdateFunctionsMap.get(awayKey);
//     if (!awayUpdateElementFunction) {
//         throw new Error(`Did not find function.`);
//     }
//     await statistic.oddSet.findOrCreate({
//         exchange: exchange,
//         statistic: statistic,
//         value: 'away',
//         updateElementsFunction: awayUpdateElementFunction,
//     });
//     const homeKey = `${statistic.name}_home`;
//     const homeUpdateElementFunction = exchangeUpdateFunctionsMap.get(homeKey);
//     if (!homeUpdateElementFunction) {
//         throw new Error(`Did not find function.`);
//     }
//     await statistic.oddSet.findOrCreate({
//         exchange: exchange,
//         statistic: statistic,
//         value: 'home',
//         updateElementsFunction: homeUpdateElementFunction,
//     });
// }
// export async function total({
//     exchange,
//     statistic,
// }: {
//     exchange: localModels.Exchange,
//     statistic: localModels.Statistic,
// }) {
//     const exchangeUpdateFunctionsMap = exchange.updateFunctionsMap;
//     const overKey = `${statistic.name}_over`;
//     const overUpdateElementFunction = exchangeUpdateFunctionsMap.get(overKey);
//     if (!overUpdateElementFunction) {
//         throw new Error(`Did not find function.`);
//     }
//     await statistic.oddSet.findOrCreate({
//         exchange: exchange,
//         statistic: statistic,
//         inequality: localModels.Inequality.Over,
//         updateElementsFunction: overUpdateElementFunction,
//     });
//     const underKey = `${statistic.name}_under`;
//     const underUpdateElementFunction = exchangeUpdateFunctionsMap.get(underKey);
//     if (!underUpdateElementFunction) {
//         throw new Error(`Did not find function.`);
//     }
//     await statistic.oddSet.findOrCreate({
//         exchange: exchange,
//         statistic: statistic,
//         inequality: localModels.Inequality.Under,
//         updateElementsFunction: underUpdateElementFunction,
//     });
// }
//# sourceMappingURL=functionsMap.js.map