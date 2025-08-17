import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "src/entities/category.entity";
import { CategoryDTO } from "./dto/category.dto";
import { UpdateCategoryDTO } from "./dto/update-category.dto";
import { AllPhotos } from "src/entities/photos-entity";
import { FileHelper } from "src/helpers/hile-helper";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        @InjectRepository(AllPhotos)
        private readonly photoRepository: Repository<AllPhotos>
    ) { }

    findAll() {
        return this.categoryRepository.find({
            relations: ['photos'],
        });
    }

    async findOne(id: number): Promise<Category | null> {
        return this.categoryRepository.findOne({
            where: { id },
            relations: ['photos'],
        });
    }

    async create(dto: CategoryDTO, file?: Express.Multer.File) {
        let parent: Category | undefined;

        if (dto.parentId) {
            const found = await this.categoryRepository.findOne({ where: { id: dto.parentId } });
            if (!found) {
                throw new NotFoundException('Parent category not found');
            }
            parent = found;
        }

        const category = this.categoryRepository.create({
            name: dto.name,
            description: dto.description,
            parent,
        });

        await this.categoryRepository.save(category);

        if (file) {
            const MAX_SIZE = 5 * 1024 * 1024;
            const ALLOWED_TYPES = ['image/jpeg', 'image/jpg'];

            if (file.size > MAX_SIZE) {
                throw new BadRequestException(`Файл ${file.originalname} превышает допустимый размер 5MB`);
            }

            if (!ALLOWED_TYPES.includes(file.mimetype)) {
                throw new BadRequestException(`Файл ${file.originalname} имеет недопустимый формат`);
            }

            const path = FileHelper.saveFile(file, 'categories');
            if (!path) {
                throw new BadRequestException('Не удалось сохранить файл');
            }

            const photoEntity = this.photoRepository.create({
                photo: path,
                category,
                product: null,
            });

            await this.photoRepository.save(photoEntity);
            category.photos = [photoEntity];
        }

        return await this.categoryRepository.findOne({
            where: { id: category.id },
            relations: ['photos', 'parent'],
        });
    }

    async update(id: number, dto: UpdateCategoryDTO, file?: Express.Multer.File) {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['photos'],
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        category.name = dto.name ?? category.name;
        category.description = dto.description ?? category.description;

        if (dto.parentId !== undefined) {
            if (dto.parentId === null) {
                category.parent = null;
            } else {
                const parent = await this.categoryRepository.findOne({ where: { id: dto.parentId } });
                if (!parent) {
                    throw new NotFoundException('Parent category not found');
                }
                category.parent = parent;
            }
        }

        if (file) {
            const MAX_SIZE = 5 * 1024 * 1024;
            const ALLOWED_TYPES = ['image/jpeg', 'image/jpg'];

            if (file.size > MAX_SIZE) {
                throw new BadRequestException(`Файл ${file.originalname} превышает допустимый размер 5MB`);
            }

            if (!ALLOWED_TYPES.includes(file.mimetype)) {
                throw new BadRequestException(`Файл ${file.originalname} имеет недопустимый формат`);
            }

            const path = FileHelper.saveFile(file, 'categories');
            if (!path) {
                throw new BadRequestException('Не удалось сохранить файл');
            }

            if (category.photos.length > 0) {
                await this.photoRepository.remove(category.photos);
            }

            const photoEntity = this.photoRepository.create({
                photo: path,
                category,
                product: null,
            });

            await this.photoRepository.save(photoEntity);
            category.photos = [photoEntity];
        }

        await this.categoryRepository.save(category);

        return await this.categoryRepository.findOne({
            where: { id },
            relations: ['photos', 'parent'],
        });
    }
}