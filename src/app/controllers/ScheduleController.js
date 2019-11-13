import { Op } from 'sequelize';
import moment from 'moment';
import User from '../models/User';
import Appointment from '../models/Appointment';


class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(400).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        date: {
          [Op.between]: [
            moment(date)
              .startOf('day')
              .format(),
            moment(date)
              .endOf('day')
              .format(),
          ],
        },
      },
    });

    return res.json({ appointments });
  }
}
export default new ScheduleController();
