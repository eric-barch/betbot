import * as classes from '../../classes';
import * as database from '../../database';

export class Exchange {
    private name: string;
    private url: string;
    private pageReader: classes.ExchangePageReader;
    private pageParser: classes.ExchangePageParser;
    private pageWriter: classes.ExchangePageWriter;
    private games: Array<classes.Game>;
    private odds: {
        current: Array<classes.Odds>, 
        lastSaved: Array<classes.Odds>,
    };
    private sequelizeModel: any;

    constructor({
        name,
        url,
        parseFunction,
        verbose = false,
    }: {
        name: string,
        url: string,
        parseFunction: Function,
        verbose?: boolean,
    }) {

        this.name = name;
        this.url = url;
        this.pageReader = new classes.ExchangePageReader({exchange: this});
        this.pageParser = new classes.ExchangePageParser({
            exchange: this,
            parseFunction: parseFunction,
        });
        this.pageWriter = new classes.ExchangePageWriter({exchange: this});
        this.games = [];
        this.odds = {
            current: [],
            lastSaved: [],
        };
        this.sequelizeModel = undefined;
    }

    // Public methods
    public async initialize({
        headless = true,
        verbose = false,
    }: {
        headless?: boolean,
        verbose?: boolean,
    } = {}) {
        verbose ? console.log(`Initializing ${this.getName()} Exchange object.`) : null;

        await this.pageReader.initialize({headless: headless, verbose: verbose});
        await this.pageParser.initialize({headless: headless, verbose: verbose});
        await this.pageWriter.initialize({headless: headless, verbose: verbose});

        this.sequelizeModel = await database.SqlExchange.findOrCreate({
            where: {
                name: this.getName(),
            },
            defaults: {
                name: this.getName(),
                url: this.getUrl(),
            },
        }).then(([exchange, created]) => {
            if (created) {
                verbose ? console.log("Exchange created: ", exchange.get({ plain: true })) : null;
            } else {
                verbose ? console.log("Exchange already exists:", exchange.get({ plain: true })) : null;
                const rowData = exchange.get({ plain: true });
                if (rowData.url !== this.getUrl()) {
                    database.SqlExchange.update(
                        { url: this.getUrl() },
                        { where: {
                            name: this.getName(),
                        }}
                    ).then((updatedRows) => {
                        verbose ? console.log(`Database URL updated to match program URL.`) : null;
                    });
                } else {
                    verbose ? console.log(`Database URL matches program URL. No update necessary.`) : null;
                }
            }
        });

        verbose ? console.log(`${this.getName()} Exchange object initialized succesfully.`) : null;
    }

    public async close({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        verbose ? console.log(`Closing ${this.getName()} Exchange object.`) : null;

        await this.pageReader.close({verbose: verbose});
        await this.pageParser.close({verbose: verbose});
        await this.pageWriter.close({verbose: verbose});

        verbose ? console.log(`${this.getName()} Exchange object closed succesfully.`) : null;
    }
    
    // Getters
    public getName({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.name;
    }

    public getNameStripped({
        verbose = false,
    }: {
        verbose?: boolean,
    }= {}) {
        return this.getName().replace(/[^a-zA-Z0-9]/g, '');
    }

    public getNameCamelCase({
        verbose = false,
    }: {
        verbose?: boolean,
    }= {}) {
        let alphanumericString = this.getNameStripped();
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }

    public getUrl({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.url;
    }

    public getPageReader({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.pageReader;
    }

    public getPageParser({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.pageParser;
    }

    public getPageWriter({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.pageWriter;
    }

    public getOdds({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.odds;
    }

    public getCurrentOdds({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.odds.current;
    }

    public getLastSavedOdds({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.odds.lastSaved;
    }

    // Private methods
    
    // Setters
    private setName({
        name,
        verbose = false,
    }: {
        name: string,
        verbose?: boolean,
    }) {
        this.name = name;
    }

    private setNameCamelCase({
        string,
        verbose = false,
    }: {
        string?: string,
        verbose?: boolean,
    } = {}) {
        let str;
        if (string == undefined) {
            str = this.name;
        } else {
            str = string;
        }
        
        let alphanumericString = str.replace(/[^a-zA-Z0-9]/g, '');
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }

    private setUrl({
        url,
        verbose = false,
    }: {
        url: string,
        verbose?: boolean,
    }) {
        this.url = url;
    }

    private setPageReader({
        pageReader,
        verbose = false,
    }: {
        pageReader: classes.ExchangePageReader,
        verbose?: boolean,
    }) {
        this.pageReader = pageReader;
    }

    private setPageParser({
        pageParser,
        verbose = false,
    }: {
        pageParser: classes.ExchangePageParser,
        verbose?: boolean,
    }) {
        this.pageParser = pageParser;
    }

    private setPageWriter({
        pageWriter,
        verbose = false,
    }: {
        pageWriter: classes.ExchangePageWriter,
        verbose?: boolean,
    }) {
        this.pageWriter = pageWriter;
    }

    public setGames({
        games,
        verbose = false,
    }: {
        games: classes.Game | Array<classes.Game>,
        verbose?: boolean,
    }) {
        if (Array.isArray(games)) {
            for (let game of games) {
                this.games.push(game);
            }
        } else {
            this.games.push(games);
        }
    }


    private setOdds({
        odds,
        verbose = false,
    }: {
        odds: {
            current: Array<classes.Odds>,
            lastSaved: Array<classes.Odds>,
        },
        verbose?: boolean,
    }) {
        this.odds = odds;
    }

    public setCurrentOdds({
        currentOdds,
        verbose = false,
    }: {
        currentOdds: Array<classes.Odds>,
        verbose?: boolean,
    }) {
        this.odds.current = currentOdds;
    }

    private setLastSavedOdds({
        lastSavedOdds,
        verbose = false,
    }: {
        lastSavedOdds: Array<classes.Odds>,
        verbose?: boolean,
    }) {
        this.odds.lastSaved = lastSavedOdds;
    }
}