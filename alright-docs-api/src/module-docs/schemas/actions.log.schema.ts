import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ActionsLogDocument = HydratedDocument<ActionsLog>;

@Schema()
export class ActionsLog {

    @Prop()
    action: string;

    @Prop({ type: Types.ObjectId, ref: "users" })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "documents" })
    docId: Types.ObjectId;

    @Prop()
    dateCreated: Date;
}

export const ActionsLogSchema = SchemaFactory.createForClass(ActionsLog);