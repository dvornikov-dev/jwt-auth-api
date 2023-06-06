import { IsNotEmpty } from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}
