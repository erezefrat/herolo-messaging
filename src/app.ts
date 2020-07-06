import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { NotFoundError } from './common/errors/not-found-error';
import { errorHandler } from './common/middlewares/error-handler';

import { signupRouter } from './routes/auth/signup';
import { signinRouter } from './routes/auth/signin';
import { signoutRouter } from './routes/auth/signout';
import { currentuserRouter } from './routes/auth/current-user';
import { currentUser } from './common/middlewares/current-user';
import { createMessageRouter } from './routes/messages/create';
import { listMessageRouter } from './routes/messages/list';
import { listUnreadMessageRouter } from './routes/messages/list-unread';
import { readMessageRouter } from './routes/messages/read';
import { deleteMessageRouter } from './routes/messages/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != 'test'
  })
);
app.use(currentUser);

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(createMessageRouter);
app.use(listMessageRouter);
app.use(listUnreadMessageRouter);
app.use(readMessageRouter);
app.use(deleteMessageRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
