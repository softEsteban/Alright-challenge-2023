import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UtilitiesModule } from './module-utilities/utilities.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './module-auth/auth.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UtilitiesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
