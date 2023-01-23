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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangePageWriter = exports.ExchangePageParser = exports.ExchangePageReader = exports.ExchangePageUtility = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class ExchangePageUtility {
    constructor({ exchange, }) {
        this.exchange = exchange;
        this.html = new HtmlScrape;
        this.browser = undefined;
        this.page = undefined;
    }
    initialize({ headless = true, verbose = false, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            verbose ? console.log(`Initializing ExchangePageUtility object for ${this.exchange.getName()}.`) : null;
            this.browser = yield puppeteer_1.default.launch({ headless: headless });
            this.page = yield this.browser.newPage();
            verbose ? console.log(`ExchangePageUtility object for ${this.exchange.getName()} initialized succesfully.`) : null;
        });
    }
}
exports.ExchangePageUtility = ExchangePageUtility;
class ExchangePageReader {
}
exports.ExchangePageReader = ExchangePageReader;
class ExchangePageParser {
}
exports.ExchangePageParser = ExchangePageParser;
class ExchangePageWriter {
}
exports.ExchangePageWriter = ExchangePageWriter;
class HtmlScrape {
}
