import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Docs } from '../schemas/docs.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateDocDto } from '../dtos/create.doc.dto';

@Injectable()
export class DocsService {
    constructor(@InjectModel('documents') private readonly docsModel: Model<Docs>) { }

    async getAllDocs(): Promise<Docs[]> {
        const result = await this.docsModel.find().exec();
        return result;
    }

    async getDocsByUser(userId: string): Promise<Docs[]> {
        const result = await this.docsModel.find({ userId: new Types.ObjectId(userId) }).exec();
        return result;
    }

    async createDoc(doc: CreateDocDto): Promise<{ message: string; doc: Docs }> {
        try {
            const createDoc = new this.docsModel(doc);
            const createdDoc = await createDoc.save();

            return {
                message: 'Doc was created',
                doc: createdDoc
            };
        } catch (error) {
            throw new ConflictException('Failed to create document');
        }
    }
}
