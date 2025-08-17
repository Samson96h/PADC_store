import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/products.dto';
import { ProducUpdateDTO } from './dto/upadate-products.dto';
import { AuthGuard } from 'src/gusrds/auth.guard';
import { Roles, RolesGuard } from 'src/gusrds/roles.guard';
import { IdDTO } from 'src/dto/id-param.dto';
import { UserRole } from 'src/entities/enums/role.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';


// @UseGuards(AuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Roles(UserRole.USER, UserRole.MANAGER, UserRole.ADMIN)
    @Get()
    getAll() {
        return this.productsService.findAll();
    }

    @Roles(UserRole.ADMIN)
    @Post('create')
    @UseInterceptors(FilesInterceptor('photo'))
    async createProduct(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: CreateProductDto
    ) {
        return this.productsService.create(dto, files);
    }



    @Roles(UserRole.USER, UserRole.MANAGER, UserRole.ADMIN)
    @Get(':id')
    getOne(@Param() param: IdDTO) {
        return this.productsService.findOne(param.id);
    }

    @Roles(UserRole.ADMIN)
    @Patch(':id')
    @UsePipes(new ValidationPipe({ skipMissingProperties: true, whitelist: true }))
    update(@Param() param: IdDTO, @Body() dto: ProducUpdateDTO) {
        return this.productsService.update(param.id, dto);
    }

    @Roles(UserRole.ADMIN)
    @Delete(':id')
    delete(@Param() param: IdDTO) {
        return this.productsService.delete(param.id);
    }
}