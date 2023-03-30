import * as models from '../../../models';
import * as parseFunctions from './parseFunctions';

export const allExchanges = new models.ExchangeSet();

// allExchanges.add(
//     new Exchange({
//         name: 'Caesar\'s',
//         url: 'https://www.williamhill.com/us/ny/bet/basketball',
//         parseFunction: parseFunctions.parseCaesars,
//     })
// );

// allExchanges.add(
//     new Exchange({
//         name: 'DraftKings',
//         url: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
//         parseFunction: parseFunctions.parseDraftKings,
//     })
// );

const exchange = new models.Exchange({
    name: 'FanDuel',
    url: 'https://sportsbook.fanduel.com/navigation/nba',
    parseFunction: parseFunctions.parseFanDuel,
})

allExchanges.add(exchange);
