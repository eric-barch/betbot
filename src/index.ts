import { exchangeNamesAndUrls, Exchange } from "./exchange";

async function main({
    verbose = false
}: {
    verbose?: boolean
} = {}) {
    let exchanges = new Map<string, Exchange>();

    for (const [key, value] of exchangeNamesAndUrls) {
        let exchange = new Exchange({name: key, url: value});
        await exchange.initialize({headless: false, verbose: verbose});
        exchanges.set(key, exchange);
    }

    
}

main({verbose: true});