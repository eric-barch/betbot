import { Exchange } from './exchange';

export class ExchangeSet extends Set<Exchange> {
    public async analyze(): Promise<void> {
        for (const exchange of this) {
            await exchange.analyze();
        }
    }

    public async close(): Promise<void> {
        for (const exchange of this) {
            await exchange.close();
        }
    }
}