export interface QuoteResponse {
    marketQuote: number;
    spread: number;
    customerQuote: number;
}

export interface CalcQuoteResponse {
    marketQuote: number;
    spread: number;
    customerQuote: number;
    payBRT: number;
}

export interface QuotePort {
    getQuote(): Promise<QuoteResponse>;

    calcQuote(amount: number): Promise<CalcQuoteResponse>;
}