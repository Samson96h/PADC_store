import { IsEmail, IsString, MinLength } from 'class-validator';

export class ForgetPasswordDTO {
    @IsEmail()
    readonly email: string;

    @IsString()
    firstName: string

    @IsString()
    @MinLength(6)
    readonly newPassword: string;
}