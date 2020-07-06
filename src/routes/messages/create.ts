import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../../common/middlewares/require-auth';
import { validateRequest } from '../../common/middlewares/validate-request';
import { User } from '../../models/User';
import { BadRequestError } from '../../common/errors/bad-request-error';
import { Message } from '../../models/Message';

const router = express.Router();

router.post(
  '/api/messages/create',
  requireAuth,
  [
    body('receiver').not().isEmpty().withMessage('Must provide receiver ID'),
    body('subject').not().isEmpty().withMessage('Must provide subject'),
    body('message').not().isEmpty().withMessage('Must provide message')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { receiver: receiverId, subject, message: messageText } = req.body;

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      throw new BadRequestError('Invalid receiver ID');
    }

    const message = Message.build({
      sender: req.currentUser!.id,
      receiver: receiver.id,
      subject,
      message: messageText,
      creationDate: new Date()
    });
    await message.save();

    res.status(201).send(message);
  }
);

export { router as createMessageRouter };
