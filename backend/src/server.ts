import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { registerModules } from './modules/index.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: false,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

registerModules(app);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`[backend] Listening on http://localhost:${config.port}`);
});

