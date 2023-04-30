import { ConnectionManager } from './connectionManager';

import * as databaseModels from '../../../../database';
import * as globalModels from '../../../../global';
import * as localModels from '../../..';

export abstract class Exchange {
    public abstract name: string;
    public abstract url: string;

    protected wrappedExchangeGames: localModels.ExchangeGameSet;
    protected wrappedOdds: localModels.OddSet;

    protected abstract wrappedConnectionManager: ConnectionManager;
    private wrappedSqlExchange: databaseModels.Exchange | null;

    public constructor() {
        this.wrappedExchangeGames = new localModels.ExchangeGameSet();
        this.wrappedOdds = new localModels.OddSet();
        this.wrappedSqlExchange = null;
    }

    public async init(): Promise<Exchange> {
        await this.connectionManager.connect();
        await this.initSqlExchange();
        return this;
    }

    protected async initSqlExchange(): Promise<databaseModels.Exchange> {
        await databaseModels.Exchange.findOrCreate({
            where: {
                name: this.name,
            },
            defaults: {
                name: this.name,
            },
        }).then(async ([sqlExchange, created]) => {
            if (!created) {
                
            }

            this.sqlExchange = sqlExchange;
        });

        return this.sqlExchange;
    }

    abstract getGames(): Promise<localModels.GameSet>;

    public async updateExchangeGames(): Promise<localModels.ExchangeGameSet | null> {
        const games = await this.getGames();

        for (const game of games) {
            this.exchangeGames.findOrCreate({
                exchange: this,
                game: game,
            })
        }

        for (const exchangeGame of this.exchangeGames) {
            if (!games.has(exchangeGame.game)) {
                this.exchangeGames.delete(exchangeGame);
            }
        }

        return this.exchangeGames;
    }

    /**TODO: only method that still needs to be refactored. ideally do not create odd until it 
     * is found on the page (or it is determined that it is not on the page, in which case it would
     * get null).
    */
    public async initOdds() {
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

    get nameStripped(): string {
        return this.name.replace(/[^a-zA-Z0-9]/g, '');
    }

    get nameCamelCase(): string {
        let alphanumericString = this.nameStripped;
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
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

    get connectionManager(): ConnectionManager {
        return this.wrappedConnectionManager;
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