import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Users>;

@Schema()
export class Users {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop()
    lastName: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    type: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);