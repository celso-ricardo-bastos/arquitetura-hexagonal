import type { QuoteProvider } from "../../application/ports/outbound/QuoteProvider.js";

interface AwesomeApiResponse {
    USDBRL: {
        bid: string;
    };
}

export class AwesomeApiQuoteAdapter implements QuoteProvider {
    async getQuote(): Promise<number> {
        const response = await fetch(
            'https://economia.awesomeapi.com.br/json/last/USD-BRL'
        );
        
        if (!response.ok) {
            throw new Error(
                'Unable to retrieve quote from AwesomeAPI'
            );
        }
        const data =
            await response.json() as AwesomeApiResponse;
        return Number(data.USDBRL.bid);
    }
}