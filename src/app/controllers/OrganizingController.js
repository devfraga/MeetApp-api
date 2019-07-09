import Meetup from '../models/Meetup';

// Listando todos meetups que ele é o organizador
class OrganizingController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
    });

    return res.json(meetups);
  }
}

export default new OrganizingController();
