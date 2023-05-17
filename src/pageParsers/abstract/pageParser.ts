import { WebpageConnector } from './webpageConnector';

export abstract class PageParser {
    protected abstract wrappedWebpageConnector: WebpageConnector;

    public async connect(): Promise<void> {
        await this.wrappedWebpageConnector.connect();
    }
}