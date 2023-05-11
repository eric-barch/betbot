import { WebpageConnector } from './webpageConnector';
import * as db from '../../db';

export abstract class PageParser {
    protected abstract wrappedWebpageConnector: WebpageConnector;

    public async connect(): Promise<void> {
        await this.wrappedWebpageConnector.connect();
    }
}