export interface QuoteResponse {
    marketQuote: number;
    spread: number;
    customerQuote: number;
}

export interface QuotePort {
    getQuote(): Promise<QuoteResponse>;
}