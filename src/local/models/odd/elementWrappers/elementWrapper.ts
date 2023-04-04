import { ElementHandle } from 'puppeteer';

import { 
    Exchange, Game, MoneyOdd, Odd, SpreadOdd, TotalOdd
} from '../../../../local/models';

export class ElementWrapper {
    private wrappedElement: ElementHandle | null;
    private wrappedExchange: Exchange;
    private wrappedGame: Game;
    private wrappedOdd: Odd | null;
    
    protected updateElementFunction: Function;

    constructor({
        exchange,
        game,
        odd,
        updateElementFunction,
    }: {
        exchange: Exchange,
        game: Game,
        odd?: Odd,
        updateElementFunction: Function,
    }) {
        this.wrappedElement = null;
        this.wrappedExchange = exchange;
        this.wrappedGame = game;

        if (odd) {
            this.wrappedOdd = odd;
        } else {
            this.wrappedOdd = null;
        }

        this.updateElementFunction = updateElementFunction;
    }

    public async updateElement() {
        await this.updateElementFunction();
    }

    get odd() {
        if (this.wrappedOdd) {
            return this.wrappedOdd;
        } else {
            throw new Error(`wrappedOdd is null.`);
        }
    }

    get element() {
        if (this.wrappedElement) {
            return this.wrappedElement;
        } else {
            return (async () => {
                const element = await this.updateElementFunction();
                return element;
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

    set exchange(exchange: Exchange) {
        this.wrappedExchange = exchange;
    }

    get game() {
        return this.wrappedGame;
    }

    set game(game: Game) {
        this.wrappedGame = game;
    }
}