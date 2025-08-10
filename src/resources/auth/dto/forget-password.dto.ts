import { IsEmail } from 'class-validator';

export class ForgetPasswordDTO {
    @IsEmail()
    readonly email: string;
}