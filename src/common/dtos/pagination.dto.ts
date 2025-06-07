import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {
    
    @ApiProperty({
        example: 10,
        description: 'Number of items to return per page',
        required: false,
        type: Number,
        minimum: 1,
        default: 10,
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        example: 0,
        description: 'Number of items to skip for pagination',
        required: false,
        type: Number,
        minimum: 0,
        default: 0,
    })
    @IsOptional()
    //@IsPositive()
    @Min(0 , { message: 'Offset must be a non-negative number' })
    @Type(() => Number)
    offset?: number;
    
  
}