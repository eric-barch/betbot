import { WebpageConnector } from './webpageConnector';

export abstract class PageParser {
    protected abstract wrappedWebpageConnector: WebpageConnector;
}