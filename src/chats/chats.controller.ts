import  RequestWithUser  from 'src/auth/requestWithUser.interface';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { MessageDto } from './dto/message.dto';
import { ChatsService } from './chats.service';
import { Body, Controller, Post, Req, UseGuards, Get } from '@nestjs/common';

@Controller('chats')
export class ChatsController {
    constructor(private chatsService: ChatsService) {}

    @UseGuards(AccessTokenGuard)
    @Post() 
    async createMessage(@Body() message: MessageDto, @Req() req: RequestWithUser) {
        const userId = req.user['sub'];
        return this.chatsService.createMessage(message, userId)
    }


    @UseGuards(AccessTokenGuard)
    @Get() 
    async getAllMessages() {
        return this.chatsService.getAllMessages()
    }
}
