export const verbosity = {
    classes: {
        exchanges: {
            exchangePageUtilities: {
                utilityImplementations: {
                    exchangePageParser: {
                        constructor: false,
                        parse: false,
                    },
                    exchangePageReader: {
                        connect: false,
                        scrape: false,
                    },
                    exchangePageWriter: {

                    },
                },
                abstractUtility: {
                    constructor: false,
                    initialize: false,
                    saveHtml: false,
                    close: false,
                    getExchange: false,
                    getHtml: false,
                    getPage: false,
                    setHtml: false,
                    setPageContent: false,
                },
                htmlScrape: {
                    constructor: false,
                    getString: false,
                    getScrapedAt: false,
                },
            },
            allExchanges: {
                constructor: false,
                initiate: true,
            },
            exchange: {
                constructor: false,
                initialize: false,
                close: false,
                getName: false,
                getNameStripped: false,
                getNameCamelCase: false,
                getUrl: false,
                getPageReader: false,
                getPageParser: false,
                getPageWriter: false,
                getOdds: false,
                getCurrentOdds: false,
                getLastSavedOdds: false,
                setName: false,
                setNameCamelCase: false,
                setUrl: false,
                setPageReader: false,
                setPageParser: false,
                setPageWriter: false,
                setGames: false,
                setOdds: false,
                setCurrentOdds: false,
                setLastSavedOdds: false,
            }
        },
        games: {
            allGames: {
                constructor: false,
                getGame: false,
                getAllGames: false,
                push: false,
            },
            game: {
                constructor: false,
                match: false,
                getAwayTeam: false,
                getHomeTeam: false,
                getStartDate: false,
                getExchanges: false,
                getOdds: false,
            }
        },
        odds: {
            oddsComponents: {
                moneyOdds: {
                    constructor: false,
                    getAwayPrice: false,
                    getHomePrice: false,
                    setAwayPrice: false,
                    setHomePrice: false,
                },
                overUnderOdds: {
                    constructor: false,
                    getOverUnder: false,
                    getOverPrice: false,
                    getUnderPrice: false,
                    setOverUnder: false,
                    setOverPrice: false,
                    setUnderPrice: false,
                },
                spreadOdds: {
                    constructor: false,
                    getAwaySpread: false,
                    getAwayPrice: false,
                    getHomeSpread: false,
                    getHomePrice: false,
                    setAwaySpread: false,
                    setAwayPrice: false,
                    setHomeSpread: false,
                    setHomePrice: false,
                },
            },
            allOdds: {
                constructor: false,
            },
            odds: {
                constructor: false,
                getGame: false,
                getExchange: false,
                getSpreadOdds: false,
                getMoneyOdds: false,
                getOverUnderOdds: false,
            },
        },
        teams: {
            allTeams: {
                constructor: false,
                getTeam: false,
                setTeams: false,
            },
            team: {
                constructor: false,
                match: false,
                getFullName: false,
                getRegionFull: false,
                getRegionAbbr: false,
                getIdentifierFull: false,
                getIdentifierAbbr: false,
                getAltNames: false,
                getRegionAbbrIdentifierFull: false,
            },
        },
    },
    database: {
        classes: {

        },
        instance: {
            instance: false,
            initiate: true,
        },
    },
    initData: false,
    state: true,
};