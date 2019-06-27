// Fazer a conexao com banco de dados
import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // Percorrendo todos os models da aplição e chamando cada metodo init e passando a conexao
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
