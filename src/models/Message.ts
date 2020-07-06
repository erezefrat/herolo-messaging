import mongoose from 'mongoose';

import { Password } from '../services/password';

// An interface that describes the properties to create a new user
interface MessageAttrs {
  sender: string;
  receiver: string;
  message: string;
  subject: string;
  creationDate: Date;
}

// An interface that describes the properties that a User Model has
interface MessageModel extends mongoose.Model<MessageDoc> {
  build(attrs: MessageAttrs): MessageDoc;
}

// An interface that describes the properties that a User Document has
interface MessageDoc extends mongoose.Document {
  sender: string;
  receiver: string;
  message: string;
  subject: string;
  creationDate: Date;
  unread: boolean;
}

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true
    },
    receiver: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    creationDate: {
      type: Date,
      required: true
    },
    unread: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

messageSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

messageSchema.statics.build = (attrs: MessageAttrs) => {
  return new Message(attrs);
};

const Message = mongoose.model<MessageDoc, MessageModel>(
  'Message',
  messageSchema
);

export { Message };
