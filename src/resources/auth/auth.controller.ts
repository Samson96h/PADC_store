import { Controller, Post, Body, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { CodeCheckingDTO } from './dto/code-checking.dto';
import { NewPasswordDTO } from './dto/new-password.dto';
import { AuthGuard } from 'src/gusrds/auth.guard';
import { AuthRequest } from 'src/main';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('newuser')
    @UseInterceptors(FileInterceptor('photo'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: RegisterDTO,
    ): Promise<{ access_token: string }> {
        const uploadDir = path.join(process.cwd(), 'uploads/users');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        const filePath = path.join(uploadDir, file.originalname);
        fs.writeFileSync(filePath, file.buffer);

        const userDataWithPhoto = { ...body, photo: file.originalname };

        return this.authService.register(userDataWithPhoto);
    }

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

    @UseGuards(AuthGuard)
    @Post('forget/check')
    async forgetCheck(@Body() codeCheckingDto: CodeCheckingDTO, @Req() req: AuthRequest) {
        return this.authService.codeChecking(codeCheckingDto, req);
    }

    @UseGuards(AuthGuard)
    @Post('forget/reset')
    async resetPassword(@Body() newPasswordDto: NewPasswordDTO, @Req() req: AuthRequest) {
        return this.authService.newPassword(newPasswordDto, req);
    }
}