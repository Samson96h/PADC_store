import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/products.dto';
import { ProducUpdateDTO } from './dto/products_update.dto';
import { AuthGuard } from 'src/gusrds/auth.guard';
import { Roles, RolesGuard } from 'src/gusrds/roles.guard';


@UseGuards(AuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Roles('admin', 'manager', 'user')
    @Get()
    getAll() {
        return this.productsService.findAll();
    }

    @Roles('admin', 'manager', 'user')
    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    @Roles('admin')
    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    @Roles('admin')
    @Patch(':id')
    @UsePipes(new ValidationPipe({ skipMissingProperties: true, whitelist: true }))
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: ProducUpdateDTO) {
        return this.productsService.update(id, dto);
    }

    @Roles('admin')
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.delete(id);
    }
}