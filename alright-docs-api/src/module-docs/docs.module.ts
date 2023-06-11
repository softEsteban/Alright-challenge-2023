import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UtilitiesModule } from '../module-utilities/utilities.module';
import { DocsController } from './controllers/docs.controller';
import { DocsService } from './services/docs.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Docs, DocsSchema } from './schemas/docs.schema';
import { JwtAuthGuard } from './jwt.auth.guard.service';

@Module({
    imports: [
        HttpModule,
        UtilitiesModule,
        PassportModule,
        MongooseModule.forFeature([{ name: 'documents', schema: DocsSchema }])
    ],
    providers: [DocsService, JwtStrategy, JwtAuthGuard],
    controllers: [DocsController]
})
export class DocsModule { }

