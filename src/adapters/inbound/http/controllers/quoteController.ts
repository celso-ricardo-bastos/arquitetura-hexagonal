import type { Request, Response } from 'express';
import type { QuotePort } from '../../../../app/ports/inbound/QuotePort.js';
import type { RequestQuoteDTO } from './dto/RequestQuoteDTO.js';
import type { ResponseQuoteDTO } from './dto/ResponseQuoteDTO.js';

export class QuoteController {

     constructor(
        private readonly quotePort: QuotePort
    ) {}

    async getQuote(req: Request, res: Response) {
        const result = await this.quotePort.getQuote();
        return res.json(result);
    }

    async calcQuote(req: Request, res: Response) {

        const requestDTO: RequestQuoteDTO = req.body
        const result = await this.quotePort.calcQuote(requestDTO.amount);
        return res.json(result as ResponseQuoteDTO);
    }


}