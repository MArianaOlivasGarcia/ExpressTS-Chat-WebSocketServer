import { Schema, model, Types  } from 'mongoose';

interface IMessage {
  from: any;
  to: any;
  text: string;
}

const messageSchema = new Schema<IMessage>({
  from: { type: Types.ObjectId, required: true },
  to: { type: Types.ObjectId, required: true },
  text: { type: String, required: true },
}, { timestamps: true });



messageSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  return object;
});


export const Message = model<IMessage>('Message', messageSchema);
