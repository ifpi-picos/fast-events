import { Role } from '../../enums/role.enum';
import { IsEnum, IsNotEmpty, IsEmail } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  nome!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  @IsEnum(Role)
  roles: any;
}
