import * as localModels from '../../../local/models';
import * as parseFunctions from './parseFunctions';

export const allExchanges = new localModels.ExchangeSet();

export async function allExchangesInit(): Promise<void> {
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

    allExchanges.add(
        await localModels.Exchange.create({
            name: 'FanDuel',
            url: 'https://sportsbook.fanduel.com/navigation/nba',
            parseFunction: parseFunctions.parseFanDuel,
        })
    );
}
