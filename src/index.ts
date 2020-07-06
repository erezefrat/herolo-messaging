import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from './app';

const start = async () => {
  // Normally this would be defined outside of any code, but for simplicity
  // I am defining it here
  process.env.JWT_KEY = 'someverysecretkey';

  // Using an in-memory Mongo DB. Again, only for simplicity and not for
  // real-world use
  const mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  const stopMongo = async () => {
    console.log('Stopping MongoDB...');
    await mongo.stop();
    await mongoose.connection.close();
  };

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    process.on('SIGINT', stopMongo);
    process.on('SIGTERM', stopMongo);

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
