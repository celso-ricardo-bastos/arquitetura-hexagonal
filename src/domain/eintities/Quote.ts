export class Quote {

    constructor(
        private readonly marketValue: number,
        private readonly spread: number
    ) {
        this.validate();
    }

    private validate(): void {

        if (this.marketValue <= 0) {
            throw new Error('Market value must be greater than zero');
        }

        if (this.spread < 0 || this.spread > 1) {
            throw new Error('Spread must be between 0 and 1');
        }
    }

    getCustomerValue(): number {
        return this.marketValue * (1 + this.spread);
    }

    getMarketValue(): number {
        return this.marketValue;
    }

    getSpread(): number {
        return this.spread;
    }

    /**
        500 × 5,40 = R$ 2.700,00

        Spread:
        2.700 × 10% = R$ 270,00

        Total:
        2.700 + 270 = R$ 2.970,00
     */
    getCalcValue(amount: number): number {
        const totalCompra = amount * this.getMarketValue();
        const spread = totalCompra * this.getSpread();
        return (spread + totalCompra);
    }
}