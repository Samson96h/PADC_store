import { IsEmail, IsInt, IsString, Max, Min, MinLength } from "class-validator";

export class RegisterDTO {
    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;

    @IsInt()
    @Min(18)
    @Max(100)
    readonly age: number

    @IsString()
    @MinLength(6)
    readonly password: string

    @IsEmail()
    readonly email: string
}