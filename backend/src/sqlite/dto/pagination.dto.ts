import { IsOptional } from 'class-validator'
import { IsInt } from '@src/utils/class-validator'
import { Transform, Expose } from 'class-transformer'

export class PaginationDto {
    @Expose()
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => value ? Number(value) : undefined)
    itemsPerPage?: number
    @Expose()
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => value ? Number(value) : undefined)
    page?: number
}