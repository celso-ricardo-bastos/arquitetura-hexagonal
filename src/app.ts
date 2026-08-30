import express from 'express';
import quoteRoutes from './adapters/inbound/http/routers/quote.route.js';

const app = express();

app.use(express.json());

app.use('/api', quoteRoutes);

export default app;