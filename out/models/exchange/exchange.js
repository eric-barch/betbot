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
exports.Exchange = void 0;
const puppeteer = __importStar(require("puppeteer"));
const models = __importStar(require(".."));
class Exchange {
    constructor({ name, url, parseFunction, }) {
        this.name = name;
        this.url = url;
        this.browser = null;
        this.page = null;
        this.parseFunction = parseFunction;
        this.gamesGroup = new models.GameSet();
        this.oddsGroup = new models.OddsSet();
        this.sequelizeInstance = null;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToExistingPage();
            this.sequelizeInstance = new models.ExchangeSequelizeInstance({ exchange: this });
            yield this.sequelizeInstance.initialize();
        });
    }
    analyze() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentOdds = yield this.getCurrentOdds();
            // Some method that compares the current odds with the odds saved in MySQL and updates them if necessary.
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser !== null) {
                yield this.browser.close();
            }
            else {
                throw new Error(`${this.constructor.name}.${this.close.name} failed. Browser is null.`);
            }
        });
    }
    connectToExistingPage() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
            const targets = yield this.browser.targets();
            if (!(targets instanceof (Array))) {
                throw new Error('Expected Array<puppeteer.Target>.');
            }
            const url = this.getUrl();
            const target = targets.find(target => target.url() === url);
            if (!(target instanceof puppeteer.Target)) {
                throw new Error('Expected Target.');
            }
            const targetPage = yield target.page(); // This is the point at which Puppeteer changes the viewport size to the default 800 x 600.
            if (!(targetPage instanceof puppeteer.Page)) {
                throw new Error('Expected page.');
            }
            // Get the window size in pixels
            const windowSize = yield targetPage.evaluate(() => {
                return {
                    width: window.outerWidth,
                    height: window.outerHeight - 75 // This seems to be roughly the height of the Chrome navigation bar. Find a less hacky way to do this.
                };
            });
            this.page = targetPage;
            this.page.setViewport(windowSize);
        });
    }
    getAll() {
        return models.allExchanges;
    }
    getCurrentOdds() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentOdds = yield this.parseFunction();
            return currentOdds;
        });
    }
    getGamesGroup() {
        return this.gamesGroup;
    }
    getName() {
        return this.name;
    }
    getNameStripped() {
        return this.getName().replace(/[^a-zA-Z0-9]/g, '');
    }
    getNameCamelCase() {
        let alphanumericString = this.getNameStripped();
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }
    getOddsGroup() {
        return this.oddsGroup;
    }
    getPage() {
        return this.page;
    }
    getSequelizeInstance() {
        return this.sequelizeInstance;
    }
    getUrl() {
        return this.url;
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map