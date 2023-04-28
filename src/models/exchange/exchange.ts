import { Browser, Page, connect, launch } from 'puppeteer';

import * as databaseModels from '../../database';
import * as globalModels from '../../global';
import * as localModels from '../../models';

export abstract class Exchange {
    public abstract name: string;
    public abstract url: string;

    protected abstract wrappedExchangeGames: localModels.ExchangeGameSet | null;
    protected abstract wrappedOdds: localModels.OddSet | null;

    private wrappedBrowser: Browser | null;
    private wrappedPage: Page | null;
    private wrappedSqlExchange: databaseModels.Exchange | null;

    public constructor() {
        this.wrappedBrowser = null;
        this.wrappedPage = null;
        this.wrappedSqlExchange = null;
    }

    public async init(): Promise<Exchange> {
        await this.connectToPage();
        await this.initSqlExchange();
        return this;
    }

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

    public async connectToBrowser(): Promise<Browser> {
        try {
            this.browser = await connect({ browserURL: 'http://127.0.0.1:9222' });
        } catch {
            throw new Error(`Browser is not open with debugging enabled.`);
            // const chromeExecutablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google\ Chrome';

            // const browser = await launch({
            //     headless: false,
            //     executablePath: chromeExecutablePath,
            //     args: [
            //         '--remote-debugging-port=9222',
            //         '--no-first-run',
            //         '--no-default-browser-check',
            //     ]
            // });

            // this.browser = browser;
        }

        return this.browser;
    }

    protected async connectToPage(): Promise<Page> {
        await this.connectToBrowser();

        let page: Page;

        try {
            page = await this.connectToExistingPage();
        } catch {
            page = await this.connectToNewPage();
        }

        return page;
    }

    private async connectToExistingPage(): Promise<Page> {
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
                height: window.outerHeight,
            };
        });

        this.page = targetPage;
        this.page.setViewport(windowSize);

        return this.page;
    }

    private async connectToNewPage(): Promise<Page> {
        const page = await this.browser.newPage();
        await page.goto(this.url);

        const windowSize = await page.evaluate(() => {
            return {
                width: window.outerWidth,
                height: window.outerHeight,
            };
        });

        this.page = page;
        page.setViewport(windowSize);

        return this.page;
    }

    abstract updateGames(): Promise<localModels.GameSet>;

    public async updateExchangeGames(): Promise<localModels.ExchangeGameSet | null> {
        const games = await this.updateGames();

        for (const game of games) {
            this.exchangeGames.findOrCreate({
                exchange: this,
                game: game,
            })
        }

        return this.exchangeGames;
    }

    public async updateOdds() {
        for (const exchangeGame of this.exchangeGames) {
            const spreadAway = await globalModels.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                name: 'spread_away',
                team: exchangeGame.game.awayTeam,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: spreadAway,
            });

            const spreadHome = await globalModels.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                name: 'spread_home',
                team: exchangeGame.game.homeTeam,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: spreadHome,
            });

            const moneylineAway = await globalModels.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                name: 'moneyline_away',
                team: exchangeGame.game.awayTeam,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: moneylineAway,
            });

            const moneylineHome = await globalModels.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                name: 'moneyline_home',
                team: exchangeGame.game.homeTeam,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: moneylineHome,
            });

            const totalOver = await globalModels.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                name: 'total_over',
                team: exchangeGame.game.awayTeam,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: totalOver,
            });

            const totalUnder = await globalModels.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                name: 'total_under',
                team: exchangeGame.game.homeTeam,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: totalUnder,
            });
        }
    }

    public async close(): Promise<void> {
        this.browser.close();
    }

    // getters and setters
    get browser(): Browser {
        if (!this.wrappedBrowser) {
            throw new Error(`${this.name} browser is null.`)
        }

        return this.wrappedBrowser;
    }

    set browser(browser: Browser) {
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

    get page(): Page {
        if (!this.wrappedPage) {
            throw new Error(`${this.name} page is null.`);
        }
        
        return this.wrappedPage;
    }

    set page(page: Page) {
        this.wrappedPage = page;
    }

    get exchangeGames() {
        if (!this.wrappedExchangeGames) {
            throw new Error(`wrappedExchangeGames is null.`);
        }

        return this.wrappedExchangeGames;
    }

    get odds() {
        if (!this.wrappedOdds) {
            throw new Error(`wrappedOdds is null.`);
        }

        return this.wrappedOdds;
    }

    get sqlExchange(): databaseModels.Exchange {
        if (!this.wrappedSqlExchange) {
            throw new Error(`${this.name} sqlExchange is null.`)
        } 
        
        return this.wrappedSqlExchange;
    }

    set sqlExchange(sqlExchange: databaseModels.Exchange) {
        this.wrappedSqlExchange = sqlExchange;
    }
}