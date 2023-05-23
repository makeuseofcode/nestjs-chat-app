import { Message, MessageSchema } from './message.schema';
import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Message.name, schema: MessageSchema }
  ])],
  controllers: [ChatsController],
  providers: [ChatsService]
})
export class ChatsModule {}
