import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateDocDto {
    @ApiProperty({ example: 'Test1', description: 'The name of the document' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'http://www.someurl.com', description: 'The URL of the document' })
    @IsNotEmpty()
    @IsUrl()
    url: string;

    @ApiProperty({ example: 'Revisión', description: 'The state of the document' })
    @IsNotEmpty()
    @IsString()
    state: string;

    @ApiProperty({ example: '64849c3742f99a47aaa85396', description: 'The ID of the user who owns the document' })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({ example: '2023-06-10T15:30:00.000Z', description: 'The date the document was created' })
    dateCreated: Date;
}
