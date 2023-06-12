import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ActionsLogDocument = HydratedDocument<ActionsLog>;

@Schema()
export class ActionsLog {
    @Prop()
    id: string;

    @Prop()
    action: string;

    @Prop()
    userId: Types.ObjectId;

    @Prop()
    docId: Types.ObjectId;

    @Prop()
    dateCreated: Date;
}

export const ActionsLogSchema = SchemaFactory.createForClass(ActionsLog);