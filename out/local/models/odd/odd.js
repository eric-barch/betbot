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
    constructor({ exchange, statistic, inequality, updateOddElementsFunction, }) {
        this.wrappedInequality = inequality;
        this.wrappedPrice = null;
        this.updateOddElementsFunction = updateOddElementsFunction.bind(this);
        this.exchange = exchange;
        this.statistic = statistic;
        this.wrappedPriceElement = null;
        this.wrappedValueElement = null;
        this.exchange.oddSet.add(this);
        this.statistic.oddSet.add(this);
    }
    async updateElements() {
        await this.updateOddElementsFunction({
            exchange: this.exchange,
            statistic: this.statistic,
        });
    }
    // getters and setters
    async getPriceElement() {
        if (!this.wrappedPriceElement) {
            await this.updateElements();
        }
        return this.wrappedPriceElement;
    }
    setPriceElement(priceElement) {
        this.wrappedPriceElement = priceElement;
    }
    async getValueElement() {
        if (!this.wrappedValueElement) {
            await this.updateElements();
        }
        return this.wrappedValueElement;
    }
    setValueElement(valueElement) {
        this.wrappedValueElement = valueElement;
    }
    getInequality() {
        return this.wrappedInequality;
    }
    getPrice() {
        return this.wrappedPrice;
    }
}
exports.Odd = Odd;
//# sourceMappingURL=odd.js.map