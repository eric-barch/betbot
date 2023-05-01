import { ConnectionManager } from './connectionManager';

import * as database from '../../../../database';
import * as global from '../../../../global';
import * as models from '../../../../models';

export abstract class Exchange {
    protected abstract wrappedName: string;
    protected abstract wrappedUrl: string;
    protected wrappedExchangeGames: models.ExchangeGameSet;
    protected wrappedOdds: models.OddSet;
    protected abstract wrappedConnectionManager: ConnectionManager;
    private wrappedSqlExchange: database.Exchange | null;

    public constructor() {
        this.wrappedExchangeGames = new models.ExchangeGameSet();
        this.wrappedOdds = new models.OddSet();
        this.wrappedSqlExchange = null;
    }

    public async init(): Promise<Exchange> {
        await this.connectionManager.connect();
        await this.initSqlExchange();
        return this;
    }

    protected async initSqlExchange(): Promise<database.Exchange> {
        await database.Exchange.findOrCreate({
            where: {
                name: this.name,
            },
            defaults: {
                name: this.name,
            },
        }).then(async ([sqlExchange, created]) => {
            this.wrappedSqlExchange = sqlExchange;
        });

        return this.sqlExchange;
    }

    abstract getGames(): Promise<models.GameSet>;

    public async updateExchangeGames(): Promise<models.ExchangeGameSet> {
        const games = await this.getGames();

        /**TODO: is there a more efficient way to do this? */
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

    public async updateOdds(): Promise<models.OddSet> {
        for (const exchangeGame of this.exchangeGames) {
            const spreadAway = await global.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                type: models.OutcomeType.SpreadAway,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: spreadAway,
            });

            const spreadHome = await global.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                type: models.OutcomeType.SpreadHome,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: spreadHome,
            });

            const moneylineAway = await global.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                type: models.OutcomeType.MoneylineAway,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: moneylineAway,
            });

            const moneylineHome = await global.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                type: models.OutcomeType.MoneylineHome,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: moneylineHome,
            });

            const totalOver = await global.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                type: models.OutcomeType.TotalOver,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: totalOver,
            });

            const totalUnder = await global.allOutcomes.findOrCreate({
                game: exchangeGame.game,
                type: models.OutcomeType.TotalUnder,
            });
            await this.odds.findOrCreate({
                exchange: this,
                outcome: totalUnder,
            });
        }

        return this.odds;
    }

    get name(): string {
        return this.wrappedName;
    }

    get url(): string {
        return this.wrappedUrl;
    }

    get nameStripped(): string {
        return this.name.replace(/[^a-zA-Z0-9]/g, '');
    }

    get nameCamelCase(): string {
        let alphanumericString = this.nameStripped;
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }

    get exchangeGames(): models.ExchangeGameSet {
        return this.wrappedExchangeGames;
    }

    get odds(): models.OddSet {
        return this.wrappedOdds;
    }

    get connectionManager(): ConnectionManager {
        return this.wrappedConnectionManager;
    }

    get sqlExchange(): database.Exchange {
        if (!this.wrappedSqlExchange) {
            throw new Error(`${this.name}.sqlExchange is null.`)
        } 
        
        return this.wrappedSqlExchange;
    }
}