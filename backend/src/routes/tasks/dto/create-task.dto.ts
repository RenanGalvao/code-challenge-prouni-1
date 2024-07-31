import { IsNotEmpty, IsString, IsInt, Min, Max } from '@src/utils/class-validator'
import { Expose, Transform } from 'class-transformer'

export class CreateTaskDto {
	@Expose()
	@IsNotEmpty()
	@IsString()
	description!: string
	@Expose()
	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(1)
	@Transform(({ value }) => Number(value))
	done!: number
}
