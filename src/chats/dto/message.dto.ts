import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MessageDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message: string

}