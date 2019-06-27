import express from 'express';
import routes from './routes';

// Importando e fazendo nossa conexao  DB
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Agora podemos fazer requisições em JSON
    this.server.use(express.json());
  }

  routes() {
    // Chamado as rotas
    this.server.use(routes);
  }
}

export default new App().server;
