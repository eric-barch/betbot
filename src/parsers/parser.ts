import { WebpageConnection } from './webpage-connection';

export abstract class Parser {
    protected abstract wrappedWebpageConnector: WebpageConnection;

    public async connect(): Promise<void> {
        await this.wrappedWebpageConnector.connect();
    }
}