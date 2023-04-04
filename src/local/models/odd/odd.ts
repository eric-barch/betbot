import { ElementHandle } from 'puppeteer';

import * as databaseModels from '../../../database/models';
import * as globalModels from '../../../global/models';
import * as localModels from '../../../local/models';
import * as parseFunctions from './updateElementFunctions';

export class ElementWrapper {
    private wrappedElement: ElementHandle | null;
    private wrappedExchange: localModels.Exchange;
    private wrappedGame: localModels.Game;
    private wrappedParent: Odd | SpreadOdd | MoneyOdd | TotalOdd | null;
    
    protected updateElementFunction: Function;

    constructor({
        exchange,
        game,
        parent,
        updateElementFunction,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        parent?: Odd | SpreadOdd | MoneyOdd | TotalOdd,
        updateElementFunction: Function,
    }) {
        this.wrappedElement = null;
        this.wrappedExchange = exchange;
        this.wrappedGame = game;

        if (parent) {
            this.wrappedParent = parent;
        } else {
            this.wrappedParent = null;
        }

        this.updateElementFunction = updateElementFunction;
    }

    public async updateElement() {
        await this.updateElementFunction();
    }

    get parent() {
        if (this.wrappedParent) {
            return this.wrappedParent;
        } else {
            throw new Error(`wrappedParent is null.`);
        }
    }

    get element() {
        if (this.wrappedElement) {
            return this.wrappedElement;
        } else {
            return (async () => {
                await this.updateElementFunction();
                return this.wrappedElement;
            })();
        }
    }

    set element(element: ElementHandle<Element> | Promise<ElementHandle<Element> | null> | null) {
        if (element instanceof Promise) {
            (async() => {
                const elementResolved = await element;
                this.wrappedElement = elementResolved;
            })();
        } else {
            this.wrappedElement = element;
        }
    }

    get exchange() {
        return this.wrappedExchange;
    }

    set exchange(exchange: localModels.Exchange) {
        this.wrappedExchange = exchange;
    }

    get game() {
        return this.wrappedGame;
    }

    set game(game: localModels.Game) {
        this.wrappedGame = game;
    }
}

export class ElementWrapperWithValue extends ElementWrapper {
    private wrappedValue: number | null;

    constructor({
        exchange,
        game,
        parent,
        updateElementFunction,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        parent: SpreadOdd | MoneyOdd | TotalOdd,
        updateElementFunction: Function,
    }) {
        super({
            exchange: exchange,
            game: game,
            parent: parent,
            updateElementFunction: updateElementFunction,
        });
        this.wrappedValue = null;
    }

    public async updateValue() {
        const element = await this.element;
        
        if (!element) {
            this.value = null;
            return;
        }
        
        const elementJson = await (await element.getProperty('textContent')).jsonValue();

        if (elementJson !== this.value) { // this is not going to work because the value getter returns null | number, not a string.
            console.log(`New odd found for ${this.exchange.name} ${this.game.name}: ${elementJson}`);
            this.value = elementJson;
        }
    }

    get value(): number | null {
        return this.wrappedValue;
    }

    set value(value: number | string | null) {
        if (value) {
            if (typeof value === 'string') {
                value = value.replace(/[^\d.-]/g, '');
            }
            
            this.wrappedValue = Number(value);
        } else {
            this.wrappedValue = null;
        }
    }
}

export class Odd extends ElementWrapper {
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
            updateElementFunction: parseFunctions.fanDuel.odd,
        });

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
    }): Promise<localModels.Odd> {
        const newOdd = new Odd({
            exchange: exchange,
            game: game,
        });

        await newOdd.init(); // Breaking here.

        globalModels.allOdds.add(newOdd);

        return newOdd;
    }

    private async init(): Promise<void> {
        const exchange = this.exchange;
        const game = this.game;

        const awayTeam = game.awayTeam;
        const homeTeam = game.homeTeam;

        const exchangeId = exchange.sqlExchange.get('id');
        const gameId = game.sqlGame.get('id');  // 
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
                totalOverPrice: totalOdd.overTotalPrice.value,
                totalUnderPrice: totalOdd.underTotalPrice.value,
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
                    totalOverPrice: totalOdd.overTotalPrice.value,
                    totalUnderPrice: totalOdd.underTotalPrice.value,
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

    public async updateComponentElements(): Promise<void> {
        await this.updateElement();
        await this.spreadOdd.updateComponentElements();
        await this.moneyOdd.updateComponentElements();
        await this.totalOdd.updateComponentElements();
    }

    public async updateValues() {
        await this.spreadOdd.updateValues();
        await this.moneyOdd.updateValues();
        await this.totalOdd.updateValues();
    }

    // getters and setters
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

export class SpreadOdd extends ElementWrapper {
    public awaySpread: ElementWrapperWithValue;
    public awayPrice: ElementWrapperWithValue;
    public homeSpread: ElementWrapperWithValue;
    public homePrice: ElementWrapperWithValue;

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
            parent: parent,
            updateElementFunction: parseFunctions.fanDuel.spreadOdd,
        });

        this.awaySpread = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.awaySpread,
        });

        this.awayPrice = new ElementWrapperWithValue({ 
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.awaySpreadPrice,
        });

        this.homeSpread = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.homeSpread,
        });

        this.homePrice = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.homeSpreadPrice,
        });
    }

    public async updateComponentElements() {
        await this.updateElement();
        await this.awaySpread.updateElement();
        await this.awayPrice.updateElement();
        await this.homeSpread.updateElement();
        await this.homePrice.updateElement();
    }

    public async updateValues() {
        await this.awaySpread.updateValue();
        await this.awayPrice.updateValue();
        await this.homeSpread.updateValue();
        await this.homePrice.updateValue();
    }
}

export class MoneyOdd extends ElementWrapper {
    public awayPrice: ElementWrapperWithValue;
    public homePrice: ElementWrapperWithValue;

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
            parent: parent,
            updateElementFunction: parseFunctions.fanDuel.moneyOdd,
        });

        this.awayPrice = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.awayMoneyPrice,
        });
        
        this.homePrice = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.homeMoneyPrice,
        });
    }

    public async updateComponentElements() {
        await this.updateElement();
        await this.awayPrice.updateElement();
        await this.homePrice.updateElement();
    }

    public async updateValues() {
        await this.awayPrice.updateValue();
        await this.homePrice.updateValue();
    }
}

export class TotalOdd extends ElementWrapper {
    public overTotal: ElementWrapperWithValue;
    public overTotalPrice: ElementWrapperWithValue;
    public underTotal: ElementWrapperWithValue;
    public underTotalPrice: ElementWrapperWithValue;

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
            parent: parent,
            updateElementFunction: parseFunctions.fanDuel.totalOdd,
        });

        this.overTotal = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.overTotal,
        });

        this.overTotalPrice = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.overTotalPrice,
        });

        this.underTotal = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.underTotal,
        });

        this.underTotalPrice = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.underTotalPrice,
        });
    }

    public async updateComponentElements() {
        await this.updateElement();
        await this.overTotal.updateElement();
        await this.overTotalPrice.updateElement();
        await this.underTotal.updateElement();
        await this.underTotalPrice.updateElement();
    }

    public async updateValues() {
        await this.overTotal.updateValue();
        await this.overTotalPrice.updateValue();
        await this.underTotal.updateValue();
        await this.underTotalPrice.updateValue();
    }
}