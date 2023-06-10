import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Users } from '../schemas/user.schema';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dtos/register.user.dto';
import { LoginUserDto } from '../dtos/login.user.dto';


@ApiTags('Authentication Service')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }


    @ApiOperation({ summary: 'Login' })
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<{ message: string; user: Users }> {
        return this.authService.login(loginUserDto);
    }

    @ApiOperation({ summary: 'Get all users' })
    @Get('getUsers')
    async getUsers(): Promise<Users[]> {
        return this.authService.getUsers();
    }

    @ApiOperation({ summary: 'Register a new user' })
    @Post('registerUser')
    async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<{ message: string; user: Users }> {
        return this.authService.registerUser(registerUserDto);
    }
}
