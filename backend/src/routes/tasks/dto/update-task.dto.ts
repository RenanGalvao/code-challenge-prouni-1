import { IsString } from '@src/utils/class-validator'
import { Expose } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class UpdateTaskDto {
    @Expose()
    @IsOptional()
    @IsString()
    description?: string
}
