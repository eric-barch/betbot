import { Exchange } from '@prisma/client';
import { League } from '@prisma/client';
import { WebpageConnector } from './webpage-connector';

export abstract class PageParser {
  private wrappedExchange: Exchange | undefined;
  private wrappedLeague: League | undefined;
  private wrappedWebpageConnector: WebpageConnector;

  constructor({ url }: {
    url: string
  }) {
    this.wrappedWebpageConnector = new WebpageConnector({ url });
  }

  public async connectToWebpage(): Promise<void> {
    await this.wrappedWebpageConnector.connect();
  }
}