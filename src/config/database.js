module.exports = {
  dialect: 'postgres',
  host: '192.168.99.100', // 192.168.99.100 ou localhost
  username: 'postgres',
  password: 'docker',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
