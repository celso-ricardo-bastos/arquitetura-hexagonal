import { Router } from 'express';
import { QuoteController } from '../controllers/quoteController.js';
import { AwesomeApiQuoteAdapter } from '../../../outbound/AwesomeApiQuoteAdapter.js';
import { QuoteApplication } from '../../../../app/QuoteApplication.js';

const router = Router();

const quoteProvider =
    new AwesomeApiQuoteAdapter();

const quoteApplication =
    new QuoteApplication(quoteProvider);

const quoteController =
    new QuoteController(quoteApplication);


router.get('/quote', (req, res) => {
    return quoteController.getQuote(req, res);
});

router.post('/quote', (req, res) => {
    return quoteController.calcQuote(req, res);
});

export default router;