import * as puppeteer from 'puppeteer';

import * as databaseModels from '../../../database/models';
import * as globalModels from '../../../global/models';
import * as localModels from '../../../local/models';

export class Exchange {
    // public properties
    public name: string;
    public url: string;

    // private properties
    
    // public linked objects
    public gameSet: localModels.GameSet;
    public oddSet: localModels.OddSet;
    
    // private linked objects
    private wrappedBrowser: puppeteer.Browser | null;
    private wrappedPage: puppeteer.Page | null;
    
    // private sequelize object
    private wrappedSqlExchange: databaseModels.Exchange | null;

    // private constructor
    private constructor({
        name,
        url,
    }: {
        name: string,
        url: string,
    }) {
        this.name = name;
        this.url = url;
        
        this.gameSet = new localModels.GameSet();
        this.oddSet = new localModels.OddSet();

        this.wrappedBrowser = null;
        this.wrappedPage = null;
        
        this.wrappedSqlExchange = null;
    }

    // public async constructor
    static async create({
        name,
        url,
    }: {
        name: string,
        url: string,
    }): Promise<Exchange> {
        const newExchange = new Exchange({
            name: name,
            url: url,
        })

        await newExchange.connectToExistingPage();

        await newExchange.initSqlExchange();

        globalModels.allExchanges.add(newExchange);

        return newExchange;

        // Should something be in here that updates Odds/Games from the db
        // if available?
    }

    // private sequelize instance constructor
    private async initSqlExchange(): Promise<databaseModels.Exchange> {
        await databaseModels.Exchange.findOrCreate({
            where: {
                name: this.name,
            },
            defaults: {
                name: this.name,
                url: this.url,
            },
        }).then(async ([sqlExchange, created]) => {
            if (!created) {
                await sqlExchange.update({
                    url: this.url,
                });
            }

            this.sqlExchange = sqlExchange;
        });

        return this.sqlExchange;
    }

    // public instance methods
    public async analyze(): Promise<void> {
        await this.updateGameSet();
        // await this.updateOddSet();
        // await this.oddSet.updateValues();
    }

    public async close(): Promise<void> {
        this.browser.close();
    }

    public async connectToExistingPage(): Promise<puppeteer.Page> {
        this.browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });

        const targets = this.browser.targets();
        const target = targets.find(target => target.url().includes(this.url));
        
        if (!target) {
            throw new Error('Expected Target.');
        }

        const targetPage = await target.page();
        
        if (!targetPage) {
            throw new Error('Expected page.');
        }

        const windowSize = await targetPage.evaluate(() => {
            return {
                width: window.outerWidth,
                height: window.outerHeight - 75 // This seems to be roughly the height of the Chrome navigation bar. Find a less hacky way to do this.
            };
        });

        this.page = targetPage;
        this.page.setViewport(windowSize);

        return this.page;
    }

    public async updateGameSet(): Promise<localModels.GameSet> {    
        // Rewrite this in a more readable way.
        const jsonGamesScriptTag = await this.page.$('script[type="application/ld+json"][data-react-helmet="true"]');
        const jsonGames = await this.page.evaluate(element => JSON.parse(element!.textContent!), jsonGamesScriptTag);
        //
        
        for (const jsonGame of jsonGames) {
            const awayTeamNameString = jsonGame.awayTeam.name;
            const homeTeamNameString = jsonGame.homeTeam.name;
    
            const awayTeamInstance = globalModels.allTeams.find({ name: awayTeamNameString });
            const homeTeamInstance = globalModels.allTeams.find({ name: homeTeamNameString });
            const startDate = new Date(jsonGame.startDate);
    
            await globalModels.allGames.findOrCreate({
                awayTeam: awayTeamInstance,
                homeTeam: homeTeamInstance,
                startDate: startDate,
            });
        }

        return this.gameSet;
    }

    public async updateOddSet(): Promise<localModels.OddSet> {
        for (const game of this.gameSet) {
            // await game.getOddByExchange({
            //     exchange: this,
            //     game: game,
            // });

            //the below should not be necessary here. this = exchange
            //this.oddSet.add(odd);
        }

        return this.oddSet;
    }

    // public static methods

    // getters and setters
    get browser(): puppeteer.Browser {
        if (this.wrappedBrowser) {
            return this.wrappedBrowser;
        } else {
            throw new Error(`${this.name} browser is null.`)
        }
    }

    set browser(browser: puppeteer.Browser) {
        this.wrappedBrowser = browser;
    }

    get nameStripped(): string {
        return this.name.replace(/[^a-zA-Z0-9]/g, '');
    }

    get nameCamelCase(): string {
        let alphanumericString = this.nameStripped;
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }

    get page(): puppeteer.Page {
        if (this.wrappedPage) {
            return this.wrappedPage;
        } else {
            throw new Error(`${this.name} page is null.`);
        }
    }

    set page(page: puppeteer.Page) {
        this.wrappedPage = page;
    }

    get sqlExchange(): databaseModels.Exchange {
        if (this.wrappedSqlExchange) {
            return this.wrappedSqlExchange;
        } else {
            throw new Error(`${this.name} sqlExchange is null.`)
        }
    }

    set sqlExchange(sqlExchange: databaseModels.Exchange) {
        this.wrappedSqlExchange = sqlExchange;
    }
}