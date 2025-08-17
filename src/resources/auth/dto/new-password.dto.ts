import { IsString, MinLength } from 'class-validator';

export class NewPasswordDTO { @IsString()
  @MinLength(6)
  readonly newPassword: string;
}