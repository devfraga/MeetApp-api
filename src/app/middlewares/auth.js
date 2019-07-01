import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Pegando o token enviado pela requisição que foi feita
  const authHeader = req.headers.authorization;

  // Se nao tiver nada dentro do authHeader
  if (!authHeader) {
    res.status(401).json({ error: 'Token not provided' });
  }

  // Desestruturando e pegando apenas o token
  const [, token] = authHeader.split(' ');

  try {
    // Se deu certo aqui dentro vao estar as informações que usamos para gerar o token
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // console.log(decoded);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }

  return next();
};
