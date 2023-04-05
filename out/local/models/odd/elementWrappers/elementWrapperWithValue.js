"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementWrapperWithValue = void 0;
const elementWrapper_1 = require("./elementWrapper");
class ElementWrapperWithValue extends elementWrapper_1.ElementWrapper {
    constructor({ exchange, game, odd, updateElementFunction, }) {
        super({
            exchange: exchange,
            game: game,
            odd: odd,
            updateElementFunction: updateElementFunction,
        });
        this.wrappedValue = null;
    }
    async updateValue() {
        const element = await this.element;
        if (!element) {
            if (this.value) {
                this.value = null;
                return true;
            }
            return false;
        }
        let elementJson = await (await element.getProperty('textContent')).jsonValue();
        let elementValue;
        if (elementJson) {
            if (typeof elementJson === 'string') {
                elementJson = elementJson.replace(/[^\d.-]/g, '');
            }
            elementValue = Number(elementJson);
        }
        else {
            elementValue = null;
        }
        if (elementValue !== this.value) {
            this.value = elementValue;
            return true;
        }
        return false;
    }
    get value() {
        return this.wrappedValue;
    }
    set value(value) {
        let valueToSet;
        if (value) {
            if (typeof value === 'string') {
                value = value.replace(/[^\d.-]/g, '');
            }
            valueToSet = Number(value);
        }
        else {
            valueToSet = null;
        }
        this.wrappedValue = valueToSet;
        //await this.odd.sqlOdd.
    }
}
exports.ElementWrapperWithValue = ElementWrapperWithValue;
//# sourceMappingURL=elementWrapperWithValue.js.map