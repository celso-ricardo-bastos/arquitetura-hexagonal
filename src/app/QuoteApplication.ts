import type { GetResponseQuoteDTO } from "#/adapters/inbound/http/controllers/dto/GetResponseQuoteDTO.js";
import type { ResponseQuoteDTO } from "#/adapters/inbound/http/controllers/dto/ResponseQuoteDTO.js";
import { Quote } from "#/domain/eintities/Quote.js";
import type { QuotePort } from "./ports/inbound/QuotePort.js";
import type { QuoteProvider } from "./ports/outbound/QuoteProvider.js";


/**
 * Meu "Caso de Uso"
 * O caso de uso representa uma ação que o sistema realiza; 
 * ele orquestra o domínio e utiliza portas para conversar com o 
 * mundo externo, sem conhecer as tecnologias que implementam essas portas.
 */
export class QuoteApplication implements QuotePort {

    constructor(
        private readonly quoteProvider: QuoteProvider
    ) {}

    async getQuote(): Promise<GetResponseQuoteDTO> {

        // 1. Busca a cotação no mundo externo
        const marketValue =
            await this.quoteProvider.getQuote();

        // 2. Cria o objeto de domínio
        const quote =
            new Quote(marketValue, 0.1);


        // 3. Obtém o valor calculado pelo domínio
        const customerValue =
            quote.getCustomerValue();

        // 4. Retorna o resultado
        return {
            marketQuote: quote.getMarketValue(),
            spread: quote.getSpread(),
            customerQuote: customerValue
        };
    }

    async calcQuote(amount: number): Promise<ResponseQuoteDTO> {

        // 1. Busca a cotação no mundo externo
        const marketValue =
            await this.quoteProvider.getQuote();

        // 2. Cria o objeto de domínio
        const quote =
            new Quote(marketValue, 0.1);


        // 3. Obtém o valor calculado pelo domínio
        const customerValue =
            quote.getCustomerValue();

        // 4. Retorna o resultado
        return {
            marketQuote: quote.getMarketValue(),
            spread: quote.getSpread(),
            customerQuote: customerValue,
            payBRT: quote.getCalcValue(amount),
        };
    }
}