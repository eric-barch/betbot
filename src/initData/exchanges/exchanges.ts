import * as parseFunctions from './parseFunctions';

export let exchanges = [    
    // {
    //     name: 'Caesar\'s',
    //     url: 'https://www.williamhill.com/us/ny/bet/basketball',
    //     parseFunction: parseFunctions.caesars,
    // },
    // {
    //     name: 'DraftKings',
    //     url: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
    //     parseFunction: parseFunctions.draftKings,
    // },
    {
        name: 'FanDuel', 
        url: 'https://sportsbook.fanduel.com/navigation/nba',
        parseFunction: parseFunctions.fanDuel,
    },
];