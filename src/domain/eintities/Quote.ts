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
}