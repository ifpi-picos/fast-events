import { Role } from '../../enums/role.enum';
export class User {
  id: number;
  nome: string;
  email: string;
  password: string;
  roles: any;
}
