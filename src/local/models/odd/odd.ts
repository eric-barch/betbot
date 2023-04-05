import { ElementHandle } from 'puppeteer';

import * as databaseModels from '../../../database/models';
import * as elementWrappers from './elementWrappers';
import * as globalModels from '../../../global/models';
import * as localModels from '../../../local/models';
import * as fanDuel from './updateElementFunctions/fanDuel';

export class Odd extends elementWrappers.ElementWrapper {
    public spreadOdd: SpreadOdd;
    public moneyOdd: MoneyOdd;
    public totalOdd: TotalOdd;

    private wrappedSqlOdd: databaseModels.Odd | null;

    constructor({
        exchange,
        game,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
    }) {
        super({
            exchange: exchange,
            game: game,
            updateElementFunction: fanDuel.odd,
        });

        this.exchange.oddSet.add(this);
        this.game.oddSet.add(this);

        this.spreadOdd = new SpreadOdd({
            exchange: exchange,
            game: game,
            parent: this,
        });
        this.moneyOdd = new MoneyOdd({
            exchange: exchange,
            game: game,
            parent: this,
        });
        this.totalOdd = new TotalOdd({
            exchange: exchange,
            game: game,
            parent: this,
        });

        this.wrappedSqlOdd = null;
    }

    // async construction methods
    public static async create({
        exchange,
        game,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
    }): Promise<Odd> {
        const newOdd = new Odd({
            exchange: exchange,
            game: game,
        });

        await newOdd.init(); // Breaking here.

        globalModels.allOdds.add(newOdd);

        return newOdd;
    }

    private async init(): Promise<Odd> {
        const exchange = this.exchange;
        const game = this.game;

        const exchangeId = exchange.sqlExchange.get('id');
        const gameId = game.sqlGame.get('id');

        const spreadOdd = this.spreadOdd;
        const moneyOdd = this.moneyOdd;
        const totalOdd = this.totalOdd;
        
        await databaseModels.Odd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                gameId: gameId,
            },
            defaults: {
                spreadAwaySpread: spreadOdd.awaySpread.value,
                spreadHomeSpread: spreadOdd.homeSpread.value,
                spreadAwayPrice: spreadOdd.awayPrice.value,
                spreadHomePrice: spreadOdd.homePrice.value,
                moneyAwayPrice: moneyOdd.awayPrice.value,
                moneyHomePrice: moneyOdd.homePrice.value,
                totalTotal: totalOdd.overTotal.value,
                totalOverPrice: totalOdd.overTotalPrice.value,
                totalUnderPrice: totalOdd.underTotalPrice.value,
                exchangeId: exchangeId,
                gameId: gameId,
            },
        }).then(async ([sqlOdd, created]) => {
            if (!created) {
                // TODO: Insert code here that transfers the current odd over to 
                // OldOdd table.

                await sqlOdd.update({
                    spreadAwaySpread: spreadOdd.awaySpread.value,
                    spreadHomeSpread: spreadOdd.homeSpread.value,
                    spreadAwayPrice: spreadOdd.awayPrice.value,
                    spreadHomePrice: spreadOdd.homePrice.value,
                    moneyAwayPrice: moneyOdd.awayPrice.value,
                    moneyHomePrice: moneyOdd.homePrice.value,
                    totalTotal: totalOdd.overTotal.value,
                    totalOverPrice: totalOdd.overTotalPrice.value,
                    totalUnderPrice: totalOdd.underTotalPrice.value,
                });
            }
            
            this.wrappedSqlOdd = sqlOdd;
        });

        return this;
    }

    // instance methods
    public matchesByExchangeAndGame({
        exchange,
        game,
    }:{
        exchange: localModels.Exchange,
        game: localModels.Game,
    }): boolean {
        if (this.exchange === exchange && this.game === game) {
            return true;
        }

        return false;
    }

    public async updateValues(): Promise<void> {
        const spreadUpdatesMade  = await this.spreadOdd.updateValues();
        const moneyUpdatesMade = await this.moneyOdd.updateValues();
        const totalUpdatesMade = await this.totalOdd.updateValues();

        if (spreadUpdatesMade || moneyUpdatesMade || totalUpdatesMade) {
            await this.sqlOdd.update({
                spreadAwaySpread: this.spreadOdd.awaySpread.value,
                spreadHomeSpread: this.spreadOdd.homeSpread.value,
                spreadAwayPrice: this.spreadOdd.awayPrice.value,
                spreadHomePrice: this.spreadOdd.homePrice.value,
                moneyAwayPrice: this.moneyOdd.awayPrice.value,
                moneyHomePrice: this.moneyOdd.homePrice.value,
                totalTotal: this.totalOdd.overTotal.value,
                totalOverPrice: this.totalOdd.overTotalPrice.value,
                totalUnderPrice: this.totalOdd.underTotalPrice.value,
            });

            console.log(`UPDATED: ${this.exchange.name} ${this.game.regionAbbrIdentifierAbbr}`);
        }
    }

    // getters and setters
    get sqlOdd(): databaseModels.Odd {
        if (this.wrappedSqlOdd) {
            return this.wrappedSqlOdd;
        } else {
            throw new Error(`${this.exchange.name} ${this.game.regionAbbrIdentifierAbbr} Odd sqlOdd is null.`);
        }
    }

    set sqlOdd(sqlOdd: databaseModels.Odd) {
        this.wrappedSqlOdd = sqlOdd;
    }
}

export class SpreadOdd extends elementWrappers.ElementWrapper {
    public awaySpread: elementWrappers.ElementWrapperWithValue;
    public awayPrice: elementWrappers.ElementWrapperWithValue;
    public homeSpread: elementWrappers.ElementWrapperWithValue;
    public homePrice: elementWrappers.ElementWrapperWithValue;

    constructor({
        exchange,
        game,
        parent,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        parent: Odd,
    }) {
        super({
            exchange: exchange,
            game: game,
            odd: parent,
            updateElementFunction: fanDuel.spreadOdd,
        });

        this.awaySpread = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.awaySpread,
        });

        this.awayPrice = new elementWrappers.ElementWrapperWithValue({ 
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.awaySpreadPrice,
        });

        this.homeSpread = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.homeSpread,
        });

        this.homePrice = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.homeSpreadPrice,
        });
    }

    public async updateValues(): Promise<boolean> {
        const awaySpreadUpdated = await this.awaySpread.updateValue();
        const awayPriceUpdated = await this.awayPrice.updateValue();
        const homeSpreadUpdated = await this.homeSpread.updateValue();
        const homePriceUpdated = await this.homePrice.updateValue();

        if (awaySpreadUpdated || awayPriceUpdated || homeSpreadUpdated || homePriceUpdated) {
            return true;
        }

        return false;
    }
}

export class MoneyOdd extends elementWrappers.ElementWrapper {
    public awayPrice: elementWrappers.ElementWrapperWithValue;
    public homePrice: elementWrappers.ElementWrapperWithValue;

    constructor({
        exchange,
        game,
        parent,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        parent: Odd,
    }) {
        super({
            exchange: exchange,
            game: game,
            odd: parent,
            updateElementFunction: fanDuel.moneyOdd,
        });

        this.awayPrice = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.awayMoneyPrice,
        });
        
        this.homePrice = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.homeMoneyPrice,
        });
    }

    public async updateValues() {
        const awayPriceUpdated = await this.awayPrice.updateValue();
        const moneyPriceUpdated = await this.homePrice.updateValue();

        if (awayPriceUpdated || moneyPriceUpdated) {
            return true;
        }

        return false;
    }
}

export class TotalOdd extends elementWrappers.ElementWrapper {
    public overTotal: elementWrappers.ElementWrapperWithValue;
    public overTotalPrice: elementWrappers.ElementWrapperWithValue;
    public underTotal: elementWrappers.ElementWrapperWithValue;
    public underTotalPrice: elementWrappers.ElementWrapperWithValue;

    constructor({
        exchange,
        game,
        parent,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        parent: Odd,
    }) {
        super({
            exchange: exchange,
            game: game,
            odd: parent,
            updateElementFunction: fanDuel.totalOdd,
        });

        this.overTotal = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.overTotal,
        });

        this.overTotalPrice = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.overTotalPrice,
        });

        this.underTotal = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.underTotal,
        });

        this.underTotalPrice = new elementWrappers.ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            odd: this.odd,
            updateElementFunction: fanDuel.underTotalPrice,
        });
    }

    public async updateValues() {
        const overTotalUpdated = await this.overTotal.updateValue();
        const overPriceUpdated = await this.overTotalPrice.updateValue();
        const underTotalUpdated = await this.underTotal.updateValue();
        const underPriceUpdated = await this.underTotalPrice.updateValue();

        if (overTotalUpdated || overPriceUpdated || underTotalUpdated || underPriceUpdated) {
            return true;
        }

        return false;
    }
}