import { Exchange } from './exchange/exchange';

export class ExchangeSet extends Set<Exchange> {
    public async close(): Promise<void> {
        for (const exchange of this) {
            await exchange.connectionManager.close();
        }
    }
}