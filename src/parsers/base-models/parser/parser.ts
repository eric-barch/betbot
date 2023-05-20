import * as p from 'puppeteer';

import { WebpageConnection } from './webpage-connection';

export abstract class Parser {
    private wrappedWebpageConnection: WebpageConnection;

    constructor() {
        this.wrappedWebpageConnection = new WebpageConnection();
    }

    public async connect(): Promise<void> {
        await this.wrappedWebpageConnection.connect();
    }

    set url(url: string) {
        this.wrappedWebpageConnection.url = url;
    }

    get page(): p.Page {
        return this.wrappedWebpageConnection.page;
    }
}