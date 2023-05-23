import { Message, MessageDocument } from './message.schema';
import { Socket } from 'socket.io';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDto } from './dto/message.dto';


@Injectable()
export class ChatsService {
    constructor(private authService: AuthService, @InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

    async getUserFromSocket(socket: Socket) {
        let auth_token = socket.handshake.headers.authorization;
        // get the token itself without "Bearer"
        auth_token = auth_token.split(' ')[1];

        const user = this.authService.getUserFromAuthenticationToken(
            auth_token
        );
        
        if (!user) {
            throw new WsException('Invalid credentials.');
        }

        return user;
    }


    async createMessage(message: MessageDto, userId: string) {
        const newMessage = new this.messageModel({...message, userId})
        await newMessage.save
        return newMessage
    }

    async getAllMessages() {
        return this.messageModel.find().populate('user')
    }

    
}
