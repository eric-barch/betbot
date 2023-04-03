import { ElementHandle } from 'puppeteer';

import * as databaseModels from '../../../database/models';
import * as globalModels from '../../../global/models';
import * as localModels from '../../../local/models';

class ElementWrapper {
    public  element: ElementHandle | null;
    
    private wrappedValue: number | null;

    constructor() {
        this.element = null;
        this.wrappedValue = null;
    }

    get value(): number | null {
        return this.wrappedValue;
    }

    set value(value: number | string | null) {
        if (value) {
            this.wrappedValue = Number(value);
        } else {
            this.wrappedValue = null;
        }
    }
}

export class Odd {
    public spreadOdd: SpreadOdd;
    public moneyOdd: MoneyOdd;
    public totalOdd: TotalOdd;

    private wrappedElement: ElementHandle | null;
    private wrappedExchange: localModels.Exchange | null;
    private wrappedGame: localModels.Game | null;
    private wrappedSqlOdd: databaseModels.Odd | null;

    constructor({
        exchange,
        game,
    }: {
        exchange?: localModels.Exchange,
        game?: localModels.Game,
    } = {}) {
        this.spreadOdd = new SpreadOdd();
        this.moneyOdd = new MoneyOdd();
        this.totalOdd = new TotalOdd();

        if (exchange) {
            this.wrappedExchange = exchange;
        } else {
            this.wrappedExchange = null;
        }

        if (game) {
            this.wrappedGame = game;
        } else {
            this.wrappedGame = null;
        }

        this.wrappedElement = null;
        this.wrappedSqlOdd = null;
    }

    // async construction methods
    public static async create({
        exchange,
        game,
    }: {
        exchange?: localModels.Exchange,
        game?: localModels.Game,
    }): Promise<localModels.Odd> {
        const newOdd = new Odd();

        if (exchange) {
            newOdd.wrappedExchange = exchange;
            exchange.oddSet.add(newOdd);
        }

        if (game) {
            newOdd.wrappedGame = game;
            game.oddSet.add(newOdd);
        }

        await newOdd.init();

        globalModels.allOdds.add(newOdd);

        return newOdd;
    }

    private async init(): Promise<void> {
        const exchange = this.exchange;
        const game = this.game;

        const awayTeam = game.awayTeam;
        const homeTeam = game.homeTeam;

        const exchangeId = exchange.sqlExchange.get('id');
        const gameId = game.sqlGame.get('id');
        const awayTeamId = awayTeam.sqlTeam.get('id');
        const homeTeamId = homeTeam.sqlTeam.get('id');

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
                totalOverPrice: totalOdd.overPrice.value,
                totalUnderPrice: totalOdd.underPrice.value,
                exchangeId: exchangeId,
                gameId: gameId,
                awayTeamId: awayTeamId,
                homeTeamId: homeTeamId,
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
                    totalOverPrice: totalOdd.overPrice.value,
                    totalUnderPrice: totalOdd.underPrice.value,
                    awayTeamId: awayTeamId,
                    homeTeamId: homeTeamId,
                });
            }
        });
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

    // getters and setters
    get element(): ElementHandle {
        if (this.wrappedElement) {
            return this.wrappedElement;
        } else {
            throw new Error(`${this.exchange.name} ${this.game.name} Odd baseHandle is null.`);
        }
    }

    set element(baseHandle: ElementHandle) {
        this.wrappedElement = baseHandle;
    }

    get exchange(): localModels.Exchange {
        if (this.wrappedExchange) {
            return this.wrappedExchange;
        } else {
            throw new Error(`${this.game.name} Odd exchange is null.`);
        }
    }

    set exchange(exchange: localModels.Exchange) {
        this.wrappedExchange = exchange;
    }

    get game(): localModels.Game {
        if (this.wrappedGame) {
            return this.wrappedGame;
        } else {
            throw new Error(`${this.exchange.name} Odd game is null.`);
        }
    }

    set game(game: localModels.Game) {
        this.game = game;
    }

    get sqlOdd(): databaseModels.Odd {
        if (this.wrappedSqlOdd) {
            return this.wrappedSqlOdd;
        } else {
            throw new Error(`${this.exchange.name} ${this.game.name} Odd sqlOdd is null.`);
        }
    }

    set sqlOdd(sqlOdd: databaseModels.Odd) {
        this.wrappedSqlOdd = sqlOdd;
    }
}

class SpreadOdd {
    public awaySpread: ElementWrapper;
    public awayPrice: ElementWrapper;
    public homeSpread: ElementWrapper;
    public homePrice: ElementWrapper;

    constructor() {
        this.awaySpread = new ElementWrapper;
        this.awayPrice = new ElementWrapper;
        this.homeSpread = new ElementWrapper;
        this.homePrice = new ElementWrapper;
    }
}

class MoneyOdd {
    public awayPrice: ElementWrapper;
    public homePrice: ElementWrapper;

    constructor() {
        this.awayPrice = new ElementWrapper;
        this.homePrice = new ElementWrapper;
    }
}

export class TotalOdd {
    public overTotal: ElementWrapper;
    public overPrice: ElementWrapper;
    public underTotal: ElementWrapper;
    public underPrice: ElementWrapper;

    constructor() {
        this.overTotal = new ElementWrapper;
        this.overPrice = new ElementWrapper;
        this.underTotal = new ElementWrapper;
        this.underPrice = new ElementWrapper;
    }
}