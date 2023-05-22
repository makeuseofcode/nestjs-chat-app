import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type UserDocument = User & Document;




@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class User {
    @Prop({ required: true, unique: true })
    username: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop()
    refreshToken: string

}


const UserSchema = SchemaFactory.createForClass(User)



export { UserSchema };
