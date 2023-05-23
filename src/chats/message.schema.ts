import { User } from './../users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type MessageDocument = Message & Document;




@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Message {
    @Prop({ required: true, unique: true })
    message: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User

}


const MessageSchema = SchemaFactory.createForClass(Message)



export { MessageSchema };
