import express, { Request, Response } from 'express';
import { requireAuth } from '../../common/middlewares/require-auth';
import { Message } from '../../models/Message';

const router = express.Router();

router.get(
  '/api/messages/list-unread',
  requireAuth,
  async (req: Request, res: Response) => {
    const messages = await Message.find({
      receiver: req.currentUser!.id,
      unread: true
    });

    res.status(200).send(messages);
  }
);

export { router as listUnreadMessageRouter };
