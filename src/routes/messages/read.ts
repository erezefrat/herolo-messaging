import express, { Request, Response } from 'express';
import { requireAuth } from '../../common/middlewares/require-auth';
import { Message } from '../../models/Message';
import { NotAuthorizedError } from '../../common/errors/not-authorized-error';

const router = express.Router();

router.get(
  '/api/messages/read/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const message = await Message.findById(req.params.id);

    if (message) {
      if (message.receiver !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }

      message.set({ unread: false });
      await message.save();
    }

    res.status(200).send(message);
  }
);

export { router as readMessageRouter };
