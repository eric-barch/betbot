import * as config from '../../../config';
import * as database from '../../../database';
import * as state from '../..';
import { HtmlScrape } from '../..';

const verbosity = config.verbosity.models.individual.exchange['exchange.ts'];

export class Exchange {
    private name: string;
    private url: string;
    private pageReader: state.ExchangePageReader;
    private pageParser: state.ExchangePageParser;
    private pageWriter: state.ExchangePageWriter;
    private games: Array<state.Game>;
    private odds: {
        current: Array<state.Odds>, 
        lastSaved: Array<state.Odds>,
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
        this.pageReader = new state.ExchangePageReader({exchange: this});
        this.pageParser = new state.ExchangePageParser({
            exchange: this,
            parseFunction: parseFunction,
        });
        this.pageWriter = new state.ExchangePageWriter({exchange: this});
        this.games = [];
        this.odds = {
            current: [],
            lastSaved: [],
        };
        this.sequelizeModel = undefined;
    }

    public async analyze() {
        const verbose = verbosity.Exchange.analyze;
        verbose ? console.log() : null;

        verbose ? console.log(`Running ${this.analyze.name} for ${this.getName()}.`) : null;

        await this.pageReader.scrape();
        verbose ? console.log(`${this.constructor.name} ${this.getName()} scraped.`) : null;

        await this.pageParser.setPageContent({html: this.pageReader.getHtml()});
        verbose ? console.log(`${this.getName()} ${this.pageParser.constructor.name} page content set.`) : null;

        // await this.pageParser.parse();
        // verbose ? console.log(`${this.getName()} ${this.pageParser.constructor.name} parsed.`) : null;
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

    public async connect() {
        await this.pageReader.initializeNewPageAndConnect();
    }

    public async initialize() {
        const verbose = verbosity.Exchange.initialize;
        verbose ? console.log() : null;
        verbose ? console.log(`Initializing ${this.constructor.name} ${this.getName()}.`) : null;

        await this.pageReader.connectToExistingPage();
        await this.pageParser.initialize();
        // await this.pageWriter.initialize();

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

    // Getters
    public getName() {
        return this.name;
    }

    public getNameStripped() {
        return this.getName().replace(/[^a-zA-Z0-9]/g, '');
    }

    public getNameCamelCase() {
        let alphanumericString = this.getNameStripped();
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }

    public getUrl() {
        return this.url;
    }

    public getPageReader() {
        return this.pageReader;
    }

    public getPageParser() {
        return this.pageParser;
    }

    public getPageWriter() {
        return this.pageWriter;
    }

    public getOdds() {
        return this.odds;
    }

    public getCurrentOdds() {
        return this.odds.current;
    }

    public getLastSavedOdds() {
        return this.odds.lastSaved;
    }

    // Private methods
    
    // Setters
    private setName({
        name,
    }: {
        name: string,
    }) {
        this.name = name;
    }

    private setNameCamelCase({
        string,
    }: {
        string?: string,
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
    }: {
        url: string,
    }) {
        this.url = url;
    }

    private setPageReader({
        pageReader,
    }: {
        pageReader: state.ExchangePageReader,
    }) {
        this.pageReader = pageReader;
    }

    private setPageParser({
        pageParser,
    }: {
        pageParser: state.ExchangePageParser,
    }) {
        this.pageParser = pageParser;
    }

    private setPageWriter({
        pageWriter,
    }: {
        pageWriter: state.ExchangePageWriter,
    }) {
        this.pageWriter = pageWriter;
    }

    public setGames({
        games,
    }: {
        games: state.Game | Array<state.Game>,
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
    }: {
        odds: {
            current: Array<state.Odds>,
            lastSaved: Array<state.Odds>,
        },
    }) {
        this.odds = odds;
    }

    public setCurrentOdds({
        currentOdds,
    }: {
        currentOdds: Array<state.Odds>,
    }) {
        this.odds.current = currentOdds;
    }

    private setLastSavedOdds({
        lastSavedOdds,
    }: {
        lastSavedOdds: Array<state.Odds>,
    }) {
        this.odds.lastSaved = lastSavedOdds;
    }
}