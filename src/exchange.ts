import { ExchangePageUtility } from "./exchange-page-utilities";
import { Game } from "./game";
import { ExchangeGameOdds } from "./odds";

export let exchangeNamesAndUrls = new Map<string, string>([
    ['FanDuel', 'https://sportsbook.fanduel.com/navigation/nfl'],
    ['DraftKings', 'https://sportsbook.draftkings.com/leagues/football/nfl'],
]);

export class Exchange {
    // Private fields
    private name: string;
    private nameCamelCase: string;
    private url: string;
    private pageReader: ExchangePageUtility;
    private pageParser: ExchangePageUtility;
    private pageWriter: ExchangePageUtility;
    private currentOdds: Map<Game, ExchangeGameOdds>;
    private lastSavedOdds: Map<Game, ExchangeGameOdds>;

    // Constructor
    constructor({
        name,
        url,
    }: {
        name: string,
        url: string,
    }) {
        this.name = name;
        this.nameCamelCase = this.toCamelCase({str: name});
        this.url = url;
        this.pageReader = new ExchangePageUtility({exchange: this});
        this.pageParser = new ExchangePageUtility({exchange: this});
        this.pageWriter = new ExchangePageUtility({exchange: this});
        this.currentOdds = new Map<Game, ExchangeGameOdds>;
        this.lastSavedOdds = new Map<Game, ExchangeGameOdds>;
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

    public toCamelCase({
        str,
        verbose = false,
    }: {
        str: string,
        verbose?: boolean,
    }) {
        let alphanumericString = str.replace(/[^a-zA-Z0-9]/g, '');
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
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
    }) {
        return this.nameCamelCase;
    }

    public getUrl({
        verbose = false,
    }: {
        verbose?: boolean,
    }) {
        return this.url;
    }

    public getPageReader({
        verbose = false,
    }: {
        verbose?: boolean,
    }) {
        return this.pageReader;
    }

    public getPageParser({
        verbose = false,
    }: {
        verbose?: boolean,
    }) {
        return this.pageParser;
    }

    public getPageWriter({
        verbose = false,
    }: {
        verbose?: boolean,
    }) {
        return this.pageWriter;
    }

    public getCurrentOdds({
        verbose = false,
    }: {
        verbose?: boolean,
    }) {
        return this.currentOdds;
    }

    public getLastSavedOdds({
        verbose = false,
    }: {
        verbose?: boolean,
    }) {
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
        nameCamelCase,
        verbose = false,
    }: {
        nameCamelCase: string,
        verbose?: boolean,
    }) {
        this.nameCamelCase = nameCamelCase;
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
        pageReader: ExchangePageUtility,
        verbose?: boolean,
    }) {
        this.pageReader = pageReader;
    }

    private setPageParser({
        pageParser,
        verbose = false,
    }: {
        pageParser: ExchangePageUtility,
        verbose?: boolean,
    }) {
        this.pageParser = pageParser;
    }

    private setPageWriter({
        pageWriter,
        verbose = false,
    }: {
        pageWriter: ExchangePageUtility,
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