import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActionLogDto {
    @ApiProperty({ example: 'User clicked the "Submit" button', description: 'The message or action' })
    @IsNotEmpty()
    @IsString()
    action: string;

    @ApiProperty({ example: '64849c3742f99a47aaa85396', description: 'The ID of the user who triggered the action' })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({ example: '64849c3742f99a47aaa85396', description: 'The ID of the document who got the action' })
    @IsNotEmpty()
    @IsString()
    docId: string;

    constructor(action, userId, docId) {
        this.action = action;
        this.userId = userId;
        this.docId = docId;
    }
}
