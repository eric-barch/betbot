import * as database from '../../../database';
import * as models from '../../../models';
import * as state from '../../../state';

export class Exchange {
    private name: string;
    private url: string;
    private pageReader: models.ExchangePageReader;
    private pageParser: models.ExchangePageParser;
    private pageWriter: models.ExchangePageWriter;
    private games: Array<models.Game>;
    private odds: {
        current: Array<models.Odds>, 
        lastSaved: Array<models.Odds>,
    };
    private sequelizeModel: any;

    constructor({
        name,
        url,
        parseFunction,
    }: {
        name: string,
        url: string,
        parseFunction: Function,
    }) {

        this.name = name;
        this.url = url;
        this.pageReader = new models.ExchangePageReader({exchange: this});
        this.pageParser = new models.ExchangePageParser({
            exchange: this,
            parseFunction: parseFunction,
        });
        this.pageWriter = new models.ExchangePageWriter({exchange: this});
        this.games = [];
        this.odds = {
            current: [],
            lastSaved: [],
        };
        this.sequelizeModel = undefined;
    }

    public async analyze() {
        await this.pageReader.scrape();
        await this.pageReader.saveHtml({filepath: '/Users/ericbarch/Documents/Development/AutomaticSportsBetting/iteration-6/html'});
        await this.pageParser.setPageContent({html: this.pageReader.getHtml()});

        console.log(`AllGames length: ${state.allGames.getLength()}`);
        console.log(`AllOdds length: ${state.allOdds.getLength()}`);
        
        const currentExchangeGames = await this.pageParser.parse();
        
        console.log(`AllGames length: ${state.allGames.getLength()}`);
        console.log(`AllOdds length: ${state.allOdds.getLength()}`);
    }

    public async close() {
        await this.pageReader.close();
        await this.pageParser.close();
        await this.pageWriter.close();
    }

    public async connect() {
        await this.pageReader.initializeNewPageAndConnect();
    }

    public async initialize() {
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
                console.log("Exchange created: ", exchange.get({ plain: true }));
            } else {
                console.log("Exchange already exists:", exchange.get({ plain: true }));
                const rowData = exchange.get({ plain: true });
                if (rowData.url !== this.getUrl()) {
                    database.SqlExchange.update(
                        { url: this.getUrl() },
                        { where: {
                            name: this.getName(),
                        }}
                    ).then((updatedRows) => {
                        console.log(`Database URL updated to match program URL.`);
                    });
                } else {
                    console.log(`Database URL matches program URL. No update necessary.`);
                }
            }
        });
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
        pageReader: models.ExchangePageReader,
    }) {
        this.pageReader = pageReader;
    }

    private setPageParser({
        pageParser,
    }: {
        pageParser: models.ExchangePageParser,
    }) {
        this.pageParser = pageParser;
    }

    private setPageWriter({
        pageWriter,
    }: {
        pageWriter: models.ExchangePageWriter,
    }) {
        this.pageWriter = pageWriter;
    }

    public setGames({
        games,
    }: {
        games: models.Game | Array<models.Game>,
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
            current: Array<models.Odds>,
            lastSaved: Array<models.Odds>,
        },
    }) {
        this.odds = odds;
    }

    public setCurrentOdds({
        currentOdds,
    }: {
        currentOdds: Array<models.Odds>,
    }) {
        this.odds.current = currentOdds;
    }

    private setLastSavedOdds({
        lastSavedOdds,
    }: {
        lastSavedOdds: Array<models.Odds>,
    }) {
        this.odds.lastSaved = lastSavedOdds;
    }
}