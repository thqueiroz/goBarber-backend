import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Appointment from '../models/Appointment';

class SchaduleController {
  async index(req, res) {
    const checkUserProvider = await User.findAll({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not provider' });
    }

    const { date } = req.query;
    const parseDate = parseISO(date);

    const appoitments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        cancelled_at: false,
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appoitments);
  }
}

export default new SchaduleController();
