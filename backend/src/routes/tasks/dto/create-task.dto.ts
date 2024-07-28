import { IsNotEmpty, IsString } from '@src/utils/class-validator'
import { Expose } from 'class-transformer'

export class CreateTaskDto {
	@Expose()
	@IsNotEmpty()
	@IsString()
	description!: string
}
