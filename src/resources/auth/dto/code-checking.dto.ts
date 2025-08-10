import { IsString } from 'class-validator';

export class CodeCheckingDTO {
  @IsString()
  readonly secretCode: string;

  @IsString()
  readonly token: string;
}