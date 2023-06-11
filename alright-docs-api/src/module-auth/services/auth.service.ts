import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Users } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '../dtos/register.user.dto';
import { LoginUserDto } from '../dtos/login.user.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel('users') private readonly usersModel: Model<Users>) { }

    async login(loginUser: LoginUserDto): Promise<{ message: string; user: Users }> {
        const { email, password } = loginUser;

        // Find the user by email
        const user = await this.usersModel.findOne({ email }).exec();

        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        // Return the user if the login is successful
        return {
            message: 'User logged in successfully',
            user,
        };
    }

    async getUsers(): Promise<Users[]> {
        const result = await this.usersModel.find().select('-password').exec();
        return result;
    }

    async getUsersSelect(): Promise<Users[]> {
        const result = await this.usersModel.find().select('id name').exec();
        return result;
    }

    async registerUser(user: RegisterUserDto): Promise<{ message: string; user: Users }> {
        const existingUser = await this.usersModel.findOne({ email: user.email }).exec();

        if (existingUser) {
            throw new ConflictException('A user with this email already exists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        const newUser = new this.usersModel({ ...user, password: hashedPassword });
        const createdUser = await newUser.save();

        return {
            message: 'User registered successfully',
            user: createdUser,
        };
    }
}