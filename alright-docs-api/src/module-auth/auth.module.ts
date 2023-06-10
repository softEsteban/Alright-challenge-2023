import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UtilitiesModule } from '../module-utilities/utilities.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt.auth.guard.service';
import { JwtStrategy } from './jwt.strategy.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/user.schema';

@Module({
    imports: [
        HttpModule,
        UtilitiesModule,
        PassportModule,
        MongooseModule.forFeature([{ name: 'users', schema: UsersSchema }])
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    controllers: [AuthController]
})
export class AuthModule { }

