import { ExchangePageReader, ExchangePageParser, ExchangePageWriter } from "./exchange-page-utilities";
import { Game } from "./games";
import { ExchangeGameOdds } from "./odds";
import { MySqlExchange, } from "./mysql";

async function parseCaesars() {

    console.log(`Parse Caesar\'s!`);

}

async function parseDraftKings() {

    console.log(`Parse DraftKings!`);

}

async function parseFanDuel() {

    console.log(`Parse FanDuel!`);

}

export let exchangeNamesAndUrls = new Map<string, any>([
    
    ['Caesar\'s', {
        url: 'https://www.williamhill.com/us/ny/bet/americanfootball',
        parseFunction: parseCaesars,
    }],

    ['DraftKings', {
        url: 'https://sportsbook.draftkings.com/leagues/football/nfl',
        parseFunction: parseDraftKings,
    }],

    ['FanDuel', {
        url: 'https://sportsbook.fanduel.com/navigation/nfl',
        parseFunction: parseFanDuel,
    }],

]);

export class Exchange {
    // Private fields
    private name: string;
    private nameCamelCase: string;
    private url: string;
    private pageReader: ExchangePageReader;
    private pageParser: ExchangePageParser;
    private pageWriter: ExchangePageWriter;
    private currentOdds: Map<Game, ExchangeGameOdds>;
    private lastSavedOdds: Map<Game, ExchangeGameOdds>;
    private sequelizeModel: any;

    // Constructor
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
        this.nameCamelCase = this.setNameCamelCase();
        this.url = url;
        this.pageReader = new ExchangePageReader({exchange: this});
        this.pageParser = new ExchangePageParser({
            exchange: this,
            parseFunction: parseFunction,
        });
        this.pageWriter = new ExchangePageWriter({exchange: this});
        this.currentOdds = new Map<Game, ExchangeGameOdds>;
        this.lastSavedOdds = new Map<Game, ExchangeGameOdds>;
        this.sequelizeModel = MySqlExchange.create({
            name: this.getName(), 
            url: this.getUrl()
        });
    }

    // Public methods
    public async initialize({
        headless = true,
        verbose = false,
    }: {
        headless?: boolean,
        verbose?: boolean,
    } = {}) {
        verbose ? console.log(`\nInitializing Exchange object for ${this.getName()}.`) : null;

        await this.pageReader.initialize({headless: headless, verbose: verbose});
        await this.pageParser.initialize({headless: headless, verbose: verbose});
        await this.pageWriter.initialize({headless: headless, verbose: verbose});

        verbose ? console.log(`Exchange object for ${this.getName()} initialized succesfully.`) : null;
    }

    public async close({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        verbose ? console.log(`\nClosing Exchange object for ${this.getName()}.`) : null;

        await this.pageReader.close({verbose: verbose});
        await this.pageParser.close({verbose: verbose});
        await this.pageWriter.close({verbose: verbose});

        verbose ? console.log(`Exchange object for ${this.getName()} closed succesfully.`) : null;
    }
    
    // Getters
    public getName({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.name;
    }

    public getNameCamelCase({
        verbose = false,
    }: {
        verbose?: boolean,
    }= {}) {
        return this.nameCamelCase;
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

    public getCurrentOdds({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.currentOdds;
    }

    public getLastSavedOdds({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.lastSavedOdds;
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
        pageReader: ExchangePageReader,
        verbose?: boolean,
    }) {
        this.pageReader = pageReader;
    }

    private setPageParser({
        pageParser,
        verbose = false,
    }: {
        pageParser: ExchangePageParser,
        verbose?: boolean,
    }) {
        this.pageParser = pageParser;
    }

    private setPageWriter({
        pageWriter,
        verbose = false,
    }: {
        pageWriter: ExchangePageWriter,
        verbose?: boolean,
    }) {
        this.pageWriter = pageWriter;
    }

    private setCurrentOdds({
        currentOdds,
        verbose = false,
    }: {
        currentOdds: Map<Game, ExchangeGameOdds>,
        verbose?: boolean,
    }) {
        this.currentOdds = currentOdds;
    }

    private setLastSavedOdds({
        lastSavedOdds,
        verbose = false,
    }: {
        lastSavedOdds: Map<Game, ExchangeGameOdds>,
        verbose?: boolean,
    }) {
        this.lastSavedOdds = lastSavedOdds;
    }
}