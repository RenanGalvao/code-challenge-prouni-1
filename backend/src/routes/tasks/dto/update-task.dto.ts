import { IsString, IsInt, Min, Max } from '@src/utils/class-validator'
import { Expose, Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class UpdateTaskDto {
    @Expose()
    @IsOptional()
    @IsString()
    description?: string
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Transform(({ value }) => Number(value))
    done?: number
}
