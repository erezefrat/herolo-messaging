import request from 'supertest';
import { app } from '../../../app';
import { Message } from '../../../models/Message';

it('creates a messsage when logged in and data is valid', async () => {
  const { user: sender, cookie: senderCookie } = await global.signin();
  const { user: receiver } = await global.signin('receiver@test.com');

  let messages = await Message.find({});
  expect(messages.length).toEqual(0);

  await request(app)
    .post('/api/messages/create')
    .set('Cookie', senderCookie)
    .send({ receiver: receiver.id, message: 'message', subject: 'subject' })
    .expect(201);

  messages = await Message.find({});
  expect(messages.length).toEqual(1);
  expect(messages[0].sender).toEqual(sender.id);
  expect(messages[0].receiver).toEqual(receiver.id);
  expect(messages[0].message).toEqual('message');
  expect(messages[0].subject).toEqual('subject');
  expect(messages[0].unread).toEqual(true);
});

it('responds with 401 if logged out', async () => {
  await request(app)
    .post('/api/messages/create')
    .send({ receiver: 'asdasd', message: 'message', subject: 'subject' })
    .expect(401);
});

it('responds with 400 if receiver id is invalid', async () => {
  const { cookie: senderCookie } = await global.signin();

  await request(app)
    .post('/api/messages/create')
    .set('Cookie', senderCookie)
    .send({ receiver: 'asdasdas', message: 'message', subject: 'subject' })
    .expect(400);
});

it('responds with 400 if message is missing', async () => {
  const { cookie: senderCookie } = await global.signin();
  const { user: receiver } = await global.signin('receiver@test.com');

  await request(app)
    .post('/api/messages/create')
    .set('Cookie', senderCookie)
    .send({ receiver: receiver.id, subject: 'subject' })
    .expect(400);
});

it('responds with 400 if subject is missing', async () => {
  const { cookie: senderCookie } = await global.signin();
  const { user: receiver } = await global.signin('receiver@test.com');

  await request(app)
    .post('/api/messages/create')
    .set('Cookie', senderCookie)
    .send({ receiver: receiver.id, message: 'message' })
    .expect(400);
});
