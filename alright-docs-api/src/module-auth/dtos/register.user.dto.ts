import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({ example: 'John', description: 'The name of the user' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ example: 'admin', description: 'The type/role of the user' })
    @IsNotEmpty()
    @IsString()
    type: string;
}
