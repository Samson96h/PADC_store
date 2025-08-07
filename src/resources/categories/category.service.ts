import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "src/entityes/category.entity";
import { CategoryDTO } from "./dto/category.dto";
import { UpdateCategoryDTO } from "./dto/categories_update.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(dto: CategoryDTO): Promise<Category> {
        const category = new Category();
        category.name = dto.name;
        category.description = dto.description;

        if (dto.parentId) {
            const parent = await this.categoryRepository.findOneBy({ id: dto.parentId });
            if (!parent) {
                throw new NotFoundException(`Parent category with ID ${dto.parentId} not found`);
            }
            category.parent = parent;
        }

        return this.categoryRepository.save(category);
    }

    async update(id: number, dto: UpdateCategoryDTO): Promise<Category> {
        await this.categoryRepository.update(id, dto);
        const updated = await this.findOne(id);

        if (!updated) {
            throw new NotFoundException("Category not found");
        }

        return updated;
    }

    async findOne(id: number): Promise<Category | null> {
        return this.categoryRepository.findOne({ where: { id }, relations: ['parent'] });
    }
}