import type { GetResponseQuoteDTO } from "../../../adapters/inbound/http/controllers/dto/GetResponseQuoteDTO.js";
import type { ResponseQuoteDTO } from "../../../adapters/inbound/http/controllers/dto/ResponseQuoteDTO.js";


export interface QuotePort {
    getQuote(): Promise<GetResponseQuoteDTO>;
    calcQuote(amount: number): Promise<ResponseQuoteDTO>;
}