import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe, } from "@nestjs/common";
import { CategoryDTO } from "./dto/category.dto";
import { UpdateCategoryDTO } from "./dto/categories_update.dto";
import { CategoryService } from "./category.service";
import { AuthGuard } from "src/gusrds/auth.guard";
import { Roles, RolesGuard } from "src/gusrds/roles.guard";

@UseGuards(AuthGuard, RolesGuard)
@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Roles("admin")
    @Post()
    create(@Body() dto: CategoryDTO) {
        return this.categoryService.create(dto);
    }

    @Roles("admin")
    @Patch(":id")
    @UsePipes(new ValidationPipe({ skipMissingProperties: true, whitelist: true }))
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCategoryDTO) {
        return this.categoryService.update(id, dto);
    }
}