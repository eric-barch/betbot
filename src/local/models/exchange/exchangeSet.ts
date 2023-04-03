import * as localModels from '../../../local/models';

export class ExchangeSet extends Set<localModels.Exchange> {
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