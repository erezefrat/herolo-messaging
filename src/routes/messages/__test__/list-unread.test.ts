import request from 'supertest';
import { app } from '../../../app';
import { Message } from '../../../models/Message';

it('gets all unread messages for a user', async () => {
  const { user, cookie } = await global.signin();

  let messages = await Message.find({ receiver: user.id });
  expect(messages.length).toEqual(0);

  // Create unread message
  let msg = await Message.build({
    sender: 'afdgfga',
    receiver: user.id,
    subject: 'subject',
    message: 'msg',
    creationDate: new Date()
  });
  await msg.save();

  // Create read message
  msg = await Message.build({
    sender: 'afdgfga',
    receiver: user.id,
    subject: 'subject',
    message: 'msg 2',
    creationDate: new Date()
  });
  msg.set({ unread: false });
  await msg.save();

  const response = await request(app)
    .get('/api/messages/list-unread')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  messages = response.body;
  expect(messages.length).toEqual(1);

  expect(messages[0].receiver).toEqual(user.id);
  expect(messages[0].unread).toEqual(true);
});
