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
const puppeteer = __importStar(require("puppeteer"));
const abstractUtil_1 = require("../abstractUtil");
const htmlScrape_1 = require("../htmlScrape");
class ExchangePageReader extends abstractUtil_1.AbstractUtility {
    connectToExistingPage() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer.connect({ browserURL: 'http://localhost:9222' });
            const targets = yield this.browser.targets();
            if (!(targets instanceof (Array))) {
                throw new Error('Expected Target[].');
            }
            const target = targets.find(target => target.url() === this.getExchange().getUrl());
            if (!(target instanceof puppeteer.Target)) {
                throw new Error('Expected Target.');
            }
            const targetPage = yield target.page(); // This is the point at which Puppeteer changes the viewport size to the default 800 x 600.
            if (!(targetPage instanceof puppeteer.Page)) {
                throw new Error('Expected page.');
            }
            this.page = targetPage;
            this.page.setViewport({
                // width: 1920,
                // height: 975,
                width: 1280,
                height: 800,
            });
        });
    }
    initializeNewPageAndConnect() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.initialize();
            try {
                yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.goto(this.exchange.getUrl(), {
                    waitUntil: 'load',
                }));
            }
            catch (error) {
                yield this.initialize();
            }
        });
    }
    scrape() {
        return __awaiter(this, void 0, void 0, function* () {
            const string = yield this.page.content();
            const scrapedAt = new Date();
            this.html = new htmlScrape_1.HtmlScrape({
                string: string,
                scrapedAt: scrapedAt,
            });
        });
    }
}
exports.ExchangePageReader = ExchangePageReader;
//# sourceMappingURL=exchangePageReader.js.map