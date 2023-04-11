"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Odd = exports.Inequality = void 0;
var Inequality;
(function (Inequality) {
    Inequality["Over"] = "over";
    Inequality["Equal"] = "equal";
    Inequality["Under"] = "under";
})(Inequality = exports.Inequality || (exports.Inequality = {}));
class Odd {
    // private constructor
    constructor({ exchange, statistic, inequality, updateElementsFunction, }) {
        this.inequality = inequality;
        this.price = null;
        this.updateElementsFunction = updateElementsFunction.bind(this);
        this.exchange = exchange;
        this.statistic = statistic;
        this.wrappedPriceElement = null;
        this.wrappedValueElement = null;
        this.exchange.oddSet.add(this);
        this.statistic.oddSet.add(this);
    }
    // public instance methods
    matches({ exchange, statistic, }) {
        const exchangeMatches = (this.exchange === exchange);
        const statisticMatches = (this.statistic === statistic);
        if (exchangeMatches && statisticMatches) {
            return true;
        }
        return false;
    }
    async updateElements() {
        await this.updateElementsFunction();
    }
    async updateValues() {
        const priceElement = await this.getWrappedPriceElement();
        const valueElement = await this.getWrappedValueElement();
        if (!priceElement) {
            this.price = null;
        }
        else {
            const priceJson = await (await priceElement.getProperty('textContent')).jsonValue();
            if (!priceJson) {
                this.price = null;
                return;
            }
            this.price = Number(priceJson.replace(/[^0-9+\-.]/g, ''));
        }
        if (!valueElement) {
            this.wrappedValue = null;
            return;
        }
        const valueJson = await (await valueElement.getProperty('textContent')).jsonValue();
        if (!valueJson) {
            this.wrappedValue = null;
            return;
        }
        // this needs to be updated to account for strings
        this.wrappedValue = Number(valueJson.replace(/[^0-9+\-.]/g, ''));
    }
    // public static methods
    // getters and setters
    async getWrappedPriceElement() {
        if (!this.wrappedPriceElement) {
            await this.updateElements();
        }
        return this.wrappedPriceElement;
    }
    async setWrappedPriceElement(element) {
        this.wrappedPriceElement = element;
    }
    async getWrappedValueElement() {
        if (!this.wrappedValueElement) {
            await this.updateElements();
        }
        return this.wrappedValueElement;
    }
    async setWrappedValueElement(element) {
        this.wrappedValueElement = element;
    }
}
exports.Odd = Odd;
//# sourceMappingURL=odd.js.map