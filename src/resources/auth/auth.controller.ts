import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { CodeCheckingDTO } from './dto/code-checking.dto';
import { NewPasswordDTO } from './dto/new-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDTO) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDTO) {
        return this.authService.login(loginDto);
    }

    @Post('forget')
    async forget(@Body() forgetPasswordDto: ForgetPasswordDTO) {
        return this.authService.forgetPassword(forgetPasswordDto)
    }

    @Post('forget/check')
    async forgetCheck(@Body() codeCheckingDto: CodeCheckingDTO) {
        return this.authService.codeChecking(codeCheckingDto)
    }

    @Post('forget/reset')
    async resetPassword(@Body() newPasswordDto: NewPasswordDTO) {
        return this.authService.newPassword(newPasswordDto);
    }
}