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
const exchange_1 = require("./exchange");
function main({ verbose = false } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let exchanges = new Map();
        for (const [key, value] of exchange_1.exchangeNamesAndUrls) {
            let exchange = new exchange_1.Exchange({ name: key, url: value });
            yield exchange.initialize({ headless: false, verbose: verbose });
            exchanges.set(key, exchange);
        }
    });
}
main({ verbose: true });
