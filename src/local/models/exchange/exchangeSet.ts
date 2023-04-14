import { Exchange } from './exchange';
import { updateFunctionsMap } from './updateFunctions';

export class ExchangeSet extends Set<Exchange> {
    public async close(): Promise<void> {
        for (const exchange of this) {
            await exchange.close();
        }
    }
}