import express, { Request, Response } from 'express';
import { requireAuth } from '../../common/middlewares/require-auth';
import { Message } from '../../models/Message';

const router = express.Router();

router.delete(
  '/api/messages/delete/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    await Message.deleteOne({
      _id: req.params.id,
      $or: [{ receiver: req.currentUser!.id }, { sender: req.currentUser!.id }]
    });

    res.status(200).send({});
  }
);

export { router as deleteMessageRouter };
