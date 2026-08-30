import type { Request, Response } from 'express';
import type { QuotePort } from '../../../../application/ports/inbound/QuotePort.js';

export class QuoteController {

     constructor(
        private readonly quotePort: QuotePort
    ) {}

    async getQuote(req: Request, res: Response) {
        const result = await this.quotePort.getQuote();
        return res.json(result);
    }

}