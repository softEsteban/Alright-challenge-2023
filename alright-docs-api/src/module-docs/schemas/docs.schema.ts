import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DocDocument = HydratedDocument<Docs>;

@Schema()
export class Docs {

    @Prop()
    name: string;

    @Prop()
    url: string;

    @Prop()
    state: string;

    @Prop()
    users: { userId: Types.ObjectId, rol: string }[]

    @Prop()
    dateCreated: Date;
}

export const DocsSchema = SchemaFactory.createForClass(Docs);