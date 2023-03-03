"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangePageParser = void 0;
const abstractUtil_1 = require("../abstractUtil");
class ExchangePageParser extends abstractUtil_1.AbstractUtility {
    constructor({ exchange, parseFunction, }) {
        super({ exchange: exchange });
        this.parseFunction = parseFunction.bind(this);
    }
    parse() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.parseFunction();
        });
    }
}
exports.ExchangePageParser = ExchangePageParser;
//# sourceMappingURL=exchangePageParser.js.map