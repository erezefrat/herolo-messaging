import request from 'supertest';
import { app } from '../../../app';
import { Message } from '../../../models/Message';

it('gets all messages for a user', async () => {
  const { user, cookie } = await global.signin();

  let messages = await Message.find({ receiver: user.id });
  expect(messages.length).toEqual(0);

  // Create one message
  let msg = await Message.build({
    sender: 'afdgfga',
    receiver: user.id,
    subject: 'subject',
    message: 'msg',
    creationDate: new Date()
  });
  await msg.save();

  // Create another message
  msg = await Message.build({
    sender: 'afdgfga',
    receiver: user.id,
    subject: 'subject',
    message: 'msg 2',
    creationDate: new Date()
  });
  await msg.save();

  const response = await request(app)
    .get('/api/messages/list')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  messages = response.body;
  expect(messages.length).toEqual(2);

  for (let message of messages) {
    expect(message.receiver).toEqual(user.id);
    expect(message.unread).toEqual(true);
  }
});
