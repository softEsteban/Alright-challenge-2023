import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Docs } from '../schemas/docs.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateDocDto } from '../dtos/create.doc.dto';
import { ActionsLog } from '../schemas/actions.log.schema';
import { CreateActionLogDto } from '../dtos/create.action.log.dto';

@Injectable()
export class DocsService {

    constructor(
        @InjectModel('documents') private readonly docsModel: Model<Docs>,
        @InjectModel('actions-logs') private readonly actionsLogModel: Model<ActionsLog>) { }

    async getAllDocs(): Promise<Docs[]> {
        const result = await this.docsModel.find().exec();
        return result;
    }

    async getDocsByUser(userId: string): Promise<Docs[]> {
        const result = await this.docsModel
            .find({ "users.userId": new Types.ObjectId(userId) })
            .sort({ dateCreated: -1 })
            .exec();
        return result;
    }

    async createDoc(doc: CreateDocDto): Promise<{ message: string; doc: Docs }> {
        try {
            const obj = {
                name: doc.name,
                url: doc.url,
                state: 'Sin revisar',
                dateCreated: new Date(),
                users: [
                    {
                        userId: new Types.ObjectId(doc.userId),
                        rol: 'Owner',
                    },
                ],
            };

            const createDoc = new this.docsModel(obj);
            const createdDoc = await createDoc.save();

            // Creates action log
            const actionLog = new CreateActionLogDto("Documento creado", doc.userId, createdDoc._id);
            this.createActionLog(actionLog);

            return {
                message: 'Doc was created',
                doc: createdDoc
            };
        } catch (error) {
            throw new ConflictException('Failed to create document');
        }
    }

    async requestRevision(docId: string, userIdGuest: string, userIdOwner: string): Promise<Docs | { message: string }> {
        const docToUpdate = await this.docsModel.findById(docId);

        if (!docToUpdate) {
            throw new NotFoundException('Document not found');
        }

        if (docToUpdate.state !== 'Sin revisar') {
            return { message: 'Document must be in "Sin revisar" state to be reviewed' };
        }

        const updatedDoc = await this.docsModel.findByIdAndUpdate(
            docId,
            {
                state: 'En revisión',
                $push: {
                    users: {
                        rol: 'Guest',
                        userId: new Types.ObjectId(userIdGuest),
                    },
                },
            },
            { new: true }
        );

        if (!updatedDoc) {
            throw new NotFoundException('Document not found');
        }

        // Creates action log
        const actionLog = new CreateActionLogDto("Documento en revisión", userIdOwner, docId);
        this.createActionLog(actionLog);

        return updatedDoc;
    }

    async createActionLog(actionLog: CreateActionLogDto): Promise<ActionsLog> {
        const obj = {
            action: actionLog.action,
            dateCreated: new Date(),
            userId: new Types.ObjectId(actionLog.userId),
            docId: new Types.ObjectId(actionLog.docId),
        }
        const createActionLog = new this.actionsLogModel(obj);
        const createdActionLog = await createActionLog.save();
        return createdActionLog;
    }

    async getDocHistory(docId: string): Promise<ActionsLog[]> {
        const actionLogs = await this.actionsLogModel
            .find({ docId: new Types.ObjectId(docId) })
            .populate('userId', 'name lastName')
            .exec();

        return actionLogs;
    }

    async handleDocument(
        docId: string,
        newState: 'Aceptado' | 'Rechazado',
        userId: string
    ): Promise<Docs> {
        const docToUpdate = await this.docsModel.findById(docId);

        if (!docToUpdate) {
            throw new NotFoundException('Document not found');
        }

        const validStates = ['En revisión'];
        if (!validStates.includes(docToUpdate.state)) {
            throw new ConflictException(
                'Document must be in "En revisión" state'
            );
        }

        const updatedDoc = await this.docsModel.findByIdAndUpdate(
            docId,
            {
                state: newState,
            },
            { new: true }
        );

        if (!updatedDoc) {
            throw new NotFoundException('Document not found');
        }

        // Creates action log
        let actionLogMessage: string;
        if (newState === 'Aceptado') {
            actionLogMessage = 'Documento aceptado';
        } else {
            actionLogMessage = 'Documento rechazado';
        }

        const actionLog = new CreateActionLogDto(actionLogMessage, userId, docId);
        await this.createActionLog(actionLog);

        return updatedDoc;
    }

}
