export interface QuoteProvider {
    getQuote(): Promise<number>;
}