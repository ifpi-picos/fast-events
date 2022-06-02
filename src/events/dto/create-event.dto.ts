import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateEventDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  title!: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(15)
  description!: string;
}
