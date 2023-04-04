"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementWrapper = void 0;
class ElementWrapper {
    constructor({ exchange, game, odd, updateElementFunction, }) {
        this.wrappedElement = null;
        this.wrappedExchange = exchange;
        this.wrappedGame = game;
        if (odd) {
            this.wrappedOdd = odd;
        }
        else {
            this.wrappedOdd = null;
        }
        this.updateElementFunction = updateElementFunction;
    }
    async updateElement() {
        await this.updateElementFunction();
    }
    get odd() {
        if (this.wrappedOdd) {
            return this.wrappedOdd;
        }
        else {
            throw new Error(`wrappedOdd is null.`);
        }
    }
    get element() {
        if (this.wrappedElement) {
            return this.wrappedElement;
        }
        else {
            return (async () => {
                const element = await this.updateElementFunction();
                return element;
            })();
        }
    }
    set element(element) {
        if (element instanceof Promise) {
            (async () => {
                const elementResolved = await element;
                this.wrappedElement = elementResolved;
            })();
        }
        else {
            this.wrappedElement = element;
        }
    }
    get exchange() {
        return this.wrappedExchange;
    }
    set exchange(exchange) {
        this.wrappedExchange = exchange;
    }
    get game() {
        return this.wrappedGame;
    }
    set game(game) {
        this.wrappedGame = game;
    }
}
exports.ElementWrapper = ElementWrapper;
//# sourceMappingURL=elementWrapper.js.map