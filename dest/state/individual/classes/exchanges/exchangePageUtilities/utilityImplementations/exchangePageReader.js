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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangePageReader = void 0;
const state = __importStar(require("../../../../../../state"));
class ExchangePageReader extends state.AbstractUtility {
    connect({ headless = true, verbose = false, } = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            verbose ? console.log(`${this.exchange.getName()} ${this.constructor.name} connecting to ${this.exchange.getUrl()}.`) : null;
            try {
                yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.goto(this.exchange.getUrl(), {
                    waitUntil: 'load',
                }));
                verbose ? console.log(`Connected successfully.`) : null;
            }
            catch (error) {
                verbose ? console.log(`Unable to connect. Site likely blocks bots.`) : null;
                yield this.initialize({ headless: headless, verbose: verbose });
            }
        });
    }
    scrape({ verbose = false, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const pages = yield this.browser.pages();
            const pageExists = pages.some(page => page.url() === this.exchange.getUrl());
            if (pageExists) {
                verbose ? console.log(`Scraping ${this.exchange.getName()}.`) : null;
                const string = yield this.page.content();
                const scrapedAt = new Date();
                this.html = new state.HtmlScrape({
                    string: string,
                    scrapedAt: scrapedAt,
                });
                verbose ? console.log(`Scraped successfully. HtmlScrape saved to ${this.exchange.getNameCamelCase()}.pageReader.html.`) : null;
            }
            else {
                verbose ? console.log(`Scrape failed. Page does not exist.`) : null;
            }
        });
    }
}
exports.ExchangePageReader = ExchangePageReader;
