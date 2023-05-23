import { ChatsService } from './chats.service';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    ConnectedSocket
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';
   
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(private chatsService: ChatsService) {}

    async handleConnection(socket: Socket) {
        await this.chatsService.getUserFromSocket(socket)
    }
   
    @SubscribeMessage('send_message')
    async listenForMessages(@MessageBody() message: MessageDto, @ConnectedSocket() socket: Socket) {

        const user = await this.chatsService.getUserFromSocket(socket)
        const newmessage = await this.chatsService.createMessage(message, user._id)

        this.server.sockets.emit('receive_message', newmessage);

        return newmessage
    }

    @SubscribeMessage('get_all_messages')
    async getAllMessages(@ConnectedSocket() socket: Socket) {

        await this.chatsService.getUserFromSocket(socket)
        const messages = await this.chatsService.getAllMessages()

        this.server.sockets.emit('receive_message', messages);

        return messages
    }


}