import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DocDocument = HydratedDocument<Docs>;

@Schema()
export class Docs {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop()
    url: string;

    @Prop()
    state: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop()
    dateCreated: Date;
}

export const DocsSchema = SchemaFactory.createForClass(Docs);