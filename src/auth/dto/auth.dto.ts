import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
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
        description: 'email property of a user and validates that it is unique',
        example: 'danny@example.com',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    email: string
}