import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CategoryDTO } from './dto/category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/gusrds/auth.guard';
import { Roles, RolesGuard } from 'src/gusrds/roles.guard';
import { IdDTO } from 'src/dto/id-param.dto';
import { UserRole } from 'src/entities/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

// @UseGuards(AuthGuard, RolesGuard)
@Controller('category')
export class CategoryController {
    productservice: any;
    constructor(private readonly categoryService: CategoryService) { }

    @Roles(UserRole.ADMIN)
    @Post('create')
    @UseInterceptors(FileInterceptor('photo'))
    uploadCategory(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CategoryDTO
    ) {
        return this.categoryService.create(body, file);
    }

    @Get()
    getAll() {
        return this.categoryService.findAll()
    }

    @Get(':id')
    getOne(@Param() param: IdDTO) {
        return this.categoryService.findOne(param.id);
    }

    @Roles(UserRole.ADMIN)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('photo'))
    updateCategory(
        @Param() param: IdDTO,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UpdateCategoryDTO
    ) {
        return this.categoryService.update(param.id, dto, file);
    }
}