import { Op } from 'sequelize';
import Queue from '../../lib/Queue';
import User from '../models/User';
import Meetup from '../models/Meetup';
import SubscriptionMail from '../jobs/SubscriptionMail';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async index(req, res) {
    /* 1 Crie uma rota para listar os meetups em que o usuário logado está inscrito.
       2 Liste apenas meetups que ainda não passaram e ordene meetups
      mais próximos como primeiros da lista. */

    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    // Pegando dados do usuario logado
    const user = await User.findByPk(req.userId);

    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [User],
    });

    // Proibindo criador do meetup se inscrever no proprio meetup
    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to you own meetups" });
    }

    // Proibindo se inscrever em meetups que já passaram
    if (meetup.past) {
      return res.status(400).json({ error: "Can't subscribe to past meetups" });
    }

    const checkDate = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    // Proibindo se inscrever em 2 meetups no mesmo horario
    if (checkDate) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time" });
    }

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }
}
export default new SubscriptionController();
