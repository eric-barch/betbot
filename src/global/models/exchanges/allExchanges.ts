import * as localModels from '../../../local';

export const allExchanges = new localModels.ExchangeSet();

export async function initAllExchanges(): Promise<void> {
    // allExchanges.add(
    //     await localModels.Exchange.create({
    //         name: 'Caesar\'s',
    //         url: 'https://www.williamhill.com/us/ny/bet/basketball',
    //         parseFunction: parseFunctions.parseCaesars,
    //     })
    // );

    // allExchanges.add(
    //     await localModels.Exchange.create({
    //         name: 'DraftKings',
    //         url: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
    //         parseFunction: parseFunctions.parseDraftKings,
    //     })
    // );

    const fanDuel = await localModels.Exchange.create({
        name: 'FanDuel',
        url: 'https://sportsbook.fanduel.com/navigation/nba',
        updateFunctions: localModels.exchange.updateFunctionsMap.get('fanDuel')!,
    });
    
    allExchanges.add(fanDuel);
}
