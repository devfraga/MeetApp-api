import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Email already existis.' });
    }

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      // Aqui devolvemos apenas o id, nome, email e providar quando registra novo usuario
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    // Como o middleware auth coloca dentro do req o id do user podemos acessar pelo req.userId;
    // console.log(req.userId);

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // Verificando se o email é diferente do que ele esta mandando agora
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      // Caso seja diferente verificando se esse email ja existe em algum usuario
      if (userExists) {
        return res.status(400).json({ error: 'Email already existis.' });
      }
    }

    // Chegando se o password antigo é igual o novo\
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Passowrd does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      // Aqui devolvemos apenas o id, nome, email e providar quando registra novo usuario
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
