import { IsString, MinLength } from "class-validator";

export class CreateMessageDto {


    constructor( createMessageDto: CreateMessageDto ) {
        this.content = createMessageDto.content;
    }

    @IsString()
    @MinLength(1)
    content: string;

}