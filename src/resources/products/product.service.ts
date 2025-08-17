import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "src/entities/product.entity";
import { Category } from "src/entities/category.entity";
import { CreateProductDto } from "./dto/products.dto";
import { ProducUpdateDTO } from "./dto/upadate-products.dto";
import { FileHelper } from "src/helpers/hile-helper";
import { AllPhotos } from "src/entities/photos-entity";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(AllPhotos)
        private readonly photoRepository: Repository<AllPhotos>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    findAll() {
        return this.productRepository.find({
            relations: ['photos', 'category'],
        });
    }

    findOne(id: number) {
        return this.productRepository.findOne({
            where: { id },
            relations: ['photos', 'category'],
        });
    }

    async create(dto: CreateProductDto, files: Express.Multer.File[]) {
        const category = await this.categoryRepository.findOne({
            where: { id: dto.categoryId },
        });
        if (!category) {
            throw new NotFoundException("Category not found");
        }

        const MAX_SIZE = 5 * 1024 * 1024;
        const ALLOWED_TYPES = ['image/jpeg', 'image/jpg'];

        const product = this.productRepository.create({
            name: dto.name,
            price: dto.price,
            description: dto.description,
            category,
        });
        await this.productRepository.save(product);

        const photoEntities: AllPhotos[] = [];

        for (const file of files) {
            if (!file) continue;

            if (file.size > MAX_SIZE) {
                throw new BadRequestException(`Файл ${file.originalname} превышает допустимый размер 5MB`);
            }

            if (!ALLOWED_TYPES.includes(file.mimetype)) {
                throw new BadRequestException(`Файл ${file.originalname} имеет недопустимый формат`);
            }

            const path = FileHelper.saveFile(file, 'products');
            if (!path) continue;

            const photoEntity = this.photoRepository.create({
                photo: path,
                product,
                category: null
            });

            photoEntities.push(photoEntity);
        }

        await this.photoRepository.save(photoEntities);

        return await this.productRepository.findOne({
            where: { id: product.id },
            relations: ['photos', 'category'],
        });
    }

    async update(id: number, dto: ProducUpdateDTO, files?: Express.Multer.File[]) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['photos', 'category'],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        product.name = dto.name ?? product.name;
        product.price = dto.price ?? product.price;
        product.description = dto.description ?? product.description;

        if (dto.categoryId !== undefined) {
            const category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
            if (!category) {
                throw new NotFoundException('Category not found');
            }
            product.category = category;
        }

        if (files && files.length > 0) {
            const MAX_SIZE = 5 * 1024 * 1024;
            const ALLOWED_TYPES = ['image/jpeg', 'image/jpg'];

            if (dto.removeOldPhotos && product.photos.length > 0) {
                await this.photoRepository.remove(product.photos);
            }

            const photoEntities: AllPhotos[] = [];

            for (const file of files) {
                if (!file) continue;

                if (file.size > MAX_SIZE) {
                    throw new BadRequestException(`Файл ${file.originalname} превышает допустимый размер 5MB`);
                }

                if (!ALLOWED_TYPES.includes(file.mimetype)) {
                    throw new BadRequestException(`Файл ${file.originalname} имеет недопустимый формат`);
                }

                const path = FileHelper.saveFile(file, 'products');
                if (!path) continue;

                const photoEntity = this.photoRepository.create({
                    photo: path,
                    product,
                    category: null,
                });

                photoEntities.push(photoEntity);
            }

            await this.photoRepository.save(photoEntities);
            product.photos = photoEntities;
        }

        await this.productRepository.save(product);

        return await this.productRepository.findOne({
            where: { id },
            relations: ['photos', 'category'],
        });
    }

    async delete(id: number) {
        const result = await this.productRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException("Product not found");
        }

        return { message: "Product deleted successfully" };
    }
}