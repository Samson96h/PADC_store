import { Body, Controller, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CategoryDTO } from "./dto/category.dto";
import { UpdateCategoryDTO } from "./dto/update-category.dto";
import { CategoryService } from "./category.service";
import { AuthGuard } from "src/gusrds/auth.guard";
import { Roles, RolesGuard } from "src/gusrds/roles.guard";
import { IdDTO } from "src/dto/id-param.dto";
import { UserRole } from "src/entities/enums/role.enum";

@UseGuards(AuthGuard, RolesGuard)
@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() dto: CategoryDTO) {
        return this.categoryService.create(dto);
    }

    @Roles(UserRole.ADMIN)
    @Patch(":id")
    update(@Param() param: IdDTO, @Body() dto: UpdateCategoryDTO) {
        return this.categoryService.update(param.id, dto);
    }
}