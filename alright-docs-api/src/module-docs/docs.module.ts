import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UtilitiesModule } from '../module-utilities/utilities.module';
import { DocsController } from './controllers/docs.controller';
import { DocsService } from './services/docs.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DocsSchema } from './schemas/docs.schema';
import { JwtAuthGuard } from './jwt.auth.guard.service';
import { ActionsLogSchema } from './schemas/actions.log.schema';
import { UsersSchema } from 'src/module-auth/schemas/user.schema';

@Module({
    imports: [
        HttpModule,
        UtilitiesModule,
        PassportModule,
        MongooseModule.forFeature(
            [
                { name: 'users', schema: UsersSchema },
                { name: 'documents', schema: DocsSchema },
                { name: 'actions-logs', schema: ActionsLogSchema },
            ])
    ],
    providers: [DocsService, JwtStrategy, JwtAuthGuard],
    controllers: [DocsController]
})
export class DocsModule { }

