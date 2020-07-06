import request from 'supertest';
import { app } from '../../../app';
import { Message } from '../../../models/Message';

it("reads a user's message", async () => {
  const { user, cookie } = await global.signin();

  // Create one message
  let msg = await Message.build({
    sender: 'afdgfga',
    receiver: user.id,
    subject: 'subject',
    message: 'msg',
    creationDate: new Date()
  });
  await msg.save();

  const response = await request(app)
    .get(`/api/messages/read/${msg.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  const message = response.body;

  expect(message.receiver).toEqual(user.id);
  expect(message.unread).toEqual(false);
});

it("returns 401 when trying to read another user's message", async () => {
  const { cookie } = await global.signin();

  // Create one message
  let msg = await Message.build({
    sender: 'afdgfga',
    receiver: 'asdsadsa',
    subject: 'subject',
    message: 'msg',
    creationDate: new Date()
  });
  await msg.save();

  await request(app)
    .get(`/api/messages/read/${msg.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(401);
});
