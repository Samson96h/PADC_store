import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDTO {
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(6)
    readonly password: string;
}