import request from 'supertest';
import { app } from '../../../app';
import { Message } from '../../../models/Message';

it("deletes a user's sent message", async () => {
  const { user, cookie } = await global.signin();

  let messages = await Message.find({});
  expect(messages.length).toEqual(0);

  // Create one message
  let msg = await Message.build({
    sender: user.id,
    receiver: 'asdsad',
    subject: 'subject',
    message: 'msg',
    creationDate: new Date()
  });
  await msg.save();

  messages = await Message.find({});
  expect(messages.length).toEqual(1);

  await request(app)
    .delete(`/api/messages/delete/${msg.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  messages = await Message.find({});
  expect(messages.length).toEqual(0);
});

it("deletes a user's received message", async () => {
  const { user, cookie } = await global.signin();

  let messages = await Message.find({});
  expect(messages.length).toEqual(0);

  // Create one message
  let msg = await Message.build({
    sender: 'dasdas',
    receiver: user.id,
    subject: 'subject',
    message: 'msg',
    creationDate: new Date()
  });
  await msg.save();

  messages = await Message.find({});
  expect(messages.length).toEqual(1);

  await request(app)
    .delete(`/api/messages/delete/${msg.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  messages = await Message.find({});
  expect(messages.length).toEqual(0);
});

it("doesn't delete a different user's message", async () => {
  const { user, cookie } = await global.signin();

  let messages = await Message.find({});
  expect(messages.length).toEqual(0);

  // Create one message
  let msg = await Message.build({
    sender: 'dasdas',
    receiver: 'asdfgsdg',
    subject: 'subject',
    message: 'msg',
    creationDate: new Date()
  });
  await msg.save();

  messages = await Message.find({});
  expect(messages.length).toEqual(1);

  await request(app)
    .delete(`/api/messages/delete/${msg.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  messages = await Message.find({});
  expect(messages.length).toEqual(1);
});
