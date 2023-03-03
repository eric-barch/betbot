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
exports.AbstractUtility = void 0;
const puppeteer = __importStar(require("puppeteer"));
const fs = __importStar(require("fs"));
const config = __importStar(require("../../../../config"));
const models = __importStar(require("../../../../models"));
class AbstractUtility {
    constructor({ exchange, }) {
        this.exchange = exchange;
        this.html = new models.HtmlScrape({ string: '' });
        this.browser = undefined;
        this.page = undefined;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const headless = config.headless;
            this.browser = yield puppeteer.launch({
                executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                headless: headless
            });
            this.page = yield this.browser.newPage();
            let pages = yield this.browser.pages();
            let blankTab = pages.shift();
            yield (blankTab === null || blankTab === void 0 ? void 0 : blankTab.close());
        });
    }
    saveHtml({ filepath, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const scrapedAt = this.getHtml().getScrapedAt();
            const year = scrapedAt.getFullYear();
            const month = ("0" + (scrapedAt.getMonth() + 1)).slice(-2);
            const day = ("0" + scrapedAt.getDate()).slice(-2);
            const hour = ("0" + scrapedAt.getHours()).slice(-2);
            const minute = ("0" + scrapedAt.getMinutes()).slice(-2);
            const second = ("0" + scrapedAt.getSeconds()).slice(-2);
            const milliseconds = ("00" + scrapedAt.getMilliseconds()).slice(-3);
            const exchangeNameStripped = this.getExchange().getNameStripped();
            const filename = `${year}.${month}.${day} ${hour}.${minute}.${second}.${milliseconds} ${exchangeNameStripped}.html`;
            fs.writeFileSync(`${filepath}/${exchangeNameStripped}/${filename}`, this.getHtml().getString(), { encoding: 'utf8' });
        });
    }
    close() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.browser) === null || _a === void 0 ? void 0 : _a.close());
        });
    }
    // Getters
    getExchange() {
        return this.exchange;
    }
    getHtml() {
        return this.html;
    }
    getPage() {
        return this.page;
    }
    // Setters
    setHtml({ html, }) {
        this.html = html;
    }
    setPageContent({ html = this.html, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.setHtml({ html: html });
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.setContent(this.getHtml().getString()));
        });
    }
}
exports.AbstractUtility = AbstractUtility;
//# sourceMappingURL=abstractUtil.js.map