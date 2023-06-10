import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { URequest } from '../module-utilities/urequest';
import { UEmail } from '../module-utilities/uemail';


@Module({
    imports: [HttpModule],
    providers: [URequest, UEmail],
    exports: [URequest, UEmail]
})
export class UtilitiesModule { }
