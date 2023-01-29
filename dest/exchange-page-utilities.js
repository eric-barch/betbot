"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ExchangePageWriter = exports.ExchangePageParser = exports.ExchangePageReader = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs = __importStar(require("fs"));
class ExchangePageUtility {
    constructor({ exchange, }) {
        this.exchange = exchange;
        this.html = new HtmlScrape({ string: '' });
        this.browser = undefined;
        this.page = undefined;
    }
    initialize({ headless = true, verbose = false, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            verbose ? console.log(`Initializing ${this.constructor.name} for ${this.exchange.getName()}.`) : null;
            this.browser = yield puppeteer_1.default.launch({ headless: headless });
            this.page = yield this.browser.newPage();
            let pages = yield this.browser.pages();
            let blankTab = pages.shift();
            yield (blankTab === null || blankTab === void 0 ? void 0 : blankTab.close());
            verbose ? console.log(`${this.constructor.name} for ${this.exchange.getName()} initialized succesfully.`) : null;
        });
    }
    saveHtml({ filepath, verbose = false, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const scrapedAt = this.getHtml().getScrapedAt();
            const year = scrapedAt.getFullYear();
            const month = ("0" + (scrapedAt.getMonth() + 1)).slice(-2);
            const day = ("0" + scrapedAt.getDate()).slice(-2);
            const hour = ("0" + scrapedAt.getHours()).slice(-2);
            const minute = ("0" + scrapedAt.getMinutes()).slice(-2);
            const second = ("0" + scrapedAt.getSeconds()).slice(-2);
            const milliseconds = ("00" + scrapedAt.getMilliseconds()).slice(-3);
            const filename = `${year}.${month}.${day} ${hour}.${minute}.${second}.${milliseconds} ${this.getExchange().getName()}.html`;
            fs.writeFileSync(`${filepath}/${filename}`, this.getHtml().getString(), { encoding: 'utf8' });
            console.log(`HTML file saved as ${filename}`);
        });
    }
    close({ verbose = false, } = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            verbose ? console.log(`Closing ${this.constructor.name} for ${this.exchange.getName()}.`) : null;
            yield ((_a = this.browser) === null || _a === void 0 ? void 0 : _a.close());
            verbose ? console.log(`${this.constructor.name} for ${this.exchange.getName()} closed successfully.`) : null;
        });
    }
    // Public methods
    // Getters
    getExchange({ verbose = false, } = {}) {
        return this.exchange;
    }
    getHtml({ verbose = false, } = {}) {
        return this.html;
    }
    getPage({ verbose = false, } = {}) {
        return this.page;
    }
    // Setters
    setHtml({ html, verbose = false, }) {
        this.html = html;
    }
}
class ExchangePageReader extends ExchangePageUtility {
    connect({ headless = true, verbose = false, } = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            verbose ? console.log(`\nConnecting ${this.constructor.name} for ${this.exchange.getName()} to ${this.exchange.getUrl()}.`) : null;
            try {
                yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.goto(this.exchange.getUrl(), {
                    waitUntil: 'load',
                }));
                verbose ? console.log(`${this.constructor.name} for ${this.exchange.getName()} connected to ${this.exchange.getUrl()} successfully.`) : null;
            }
            catch (error) {
                verbose ? console.log(`${this.constructor.name} for ${this.exchange.getName()} unable to connect to ${this.exchange.getUrl()}. Site likely blocks bot traffic.`) : null;
                yield this.initialize({ headless: headless, verbose: verbose });
            }
        });
    }
    scrape({ verbose = false, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const pages = yield this.browser.pages();
            const pageExists = pages.some(page => page.url() === this.exchange.getUrl());
            if (pageExists) {
                verbose ? console.log(`\nScraping ${this.exchange.getName()}.`) : null;
                const string = yield this.page.content();
                const scrapedAt = new Date();
                this.html = new HtmlScrape({
                    string: string,
                    scrapedAt: scrapedAt,
                });
                verbose ? console.log(`${this.exchange.getName()} scraped successfully.`) : null;
            }
            else {
                verbose ? console.log(`Cannot scrape ${this.exchange.getName()}. Page does not exist.`) : null;
            }
        });
    }
}
exports.ExchangePageReader = ExchangePageReader;
class ExchangePageParser extends ExchangePageUtility {
    constructor({ exchange, parseFunction, }) {
        super({ exchange: exchange });
        this.parseFunction = parseFunction;
    }
    parseGames({ verbose = false, }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.parseFunction();
        });
    }
}
exports.ExchangePageParser = ExchangePageParser;
class ExchangePageWriter extends ExchangePageUtility {
}
exports.ExchangePageWriter = ExchangePageWriter;
class HtmlScrape {
    constructor({ string, scrapedAt, }) {
        this.string = string;
        scrapedAt ? this.scrapedAt = scrapedAt : this.scrapedAt = new Date();
    }
    // Public methods
    // Getters
    getString({ verbose = false, } = {}) {
        return this.string;
    }
    getScrapedAt({ verbose = false, } = {}) {
        return this.scrapedAt;
    }
}
