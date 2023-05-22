import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Match } from "../decorators/match.decorator";

export class CreateUserDto {
    @ApiProperty({
        type: String,
        description: 'username property of a user and ensures it is unique',
        example: 'danny',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    username: string

    @ApiProperty({
        type: String,
        description: 'password property of a user',
        example: 'password',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({
        type: String,
        description: 'allows user to confirm the previously entered password and validates them',
        example: 'password',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Passwords should match'})
    passwordConfirm: string

    @ApiProperty({
        type: String,
        description: 'email property of a user and validates that it is unique',
        example: 'danny@example.com',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    email: string

    
    refreshToken: string;

}