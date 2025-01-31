import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Docs } from '../schemas/docs.schema';
import { DocsService } from '../services/docs.service';
import { Types } from 'mongoose';
import { CreateDocDto } from '../dtos/create.doc.dto';


@ApiTags('Documents Service')
@Controller('docs')
export class DocsController {

    constructor(private docsService: DocsService) { }

    @ApiOperation({ summary: 'Get all docs' })
    @Get('getAllDocs')
    async getAllDocs(): Promise<Docs[]> {
        return this.docsService.getAllDocs();
    }

    @ApiOperation({ summary: 'Get all docs by user' })
    @Get('getDocsByUser/:userId')
    async getDocsByUser(@Param('userId') userId: string): Promise<Docs[]> {
        return this.docsService.getDocsByUser(userId);
    }

    @ApiOperation({ summary: 'Create a new document' })
    @Post('createDoc')
    async createDoc(@Body() doc: CreateDocDto): Promise<{}> {
        return this.docsService.createDoc(doc);
    }

    @ApiOperation({ summary: 'Request revision for a document' })
    @Put('requestRevision/:docId/:userIdGuest/:userIdOwner')
    async requestRevision(@Param('docId') docId: string, @Param('userIdGuest') userIdGuest: string, @Param('userIdOwner') userIdOwner: string): Promise<{}> {
        return this.docsService.requestRevision(docId, userIdGuest, userIdOwner);
    }

    @ApiOperation({ summary: 'Gets all actions log by document' })
    @Get('getDocHistory/:docId')
    async getDocHistory(@Param('docId') docId: string): Promise<{}> {
        return this.docsService.getDocHistory(docId);
    }

    @ApiOperation({ summary: 'Handles a document that is being reviewed' })
    @Put('handleDocument/:docId/:newState/:userId')
    async handleDocument(
        @Param('docId') docId: string,
        @Param('newState') newState: 'Aceptado' | 'Rechazado',
        @Param('userId') userId: string
    ): Promise<Docs> {
        return this.docsService.handleDocument(docId, newState, userId);
    }

}
