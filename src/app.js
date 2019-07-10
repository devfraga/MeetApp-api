import 'dotenv/config';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import express from 'express';
import path from 'path';
import configSentry from './config/sentry';
import 'express-async-errors';
import routes from './routes';

// Importando e fazendo nossa conexao  DB
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(configSentry);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());

    // Agora podemos fazer requisições em JSON
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    // Chamado as rotas
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
