import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "src/entities/product.entity";
import { Category } from "src/entities/category.entity";
import { CreateProductDto } from "./dto/products.dto";
import { ProducUpdateDTO } from "./dto/upadate-products.dto";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    findAll() {
        return this.productRepository.find();
    }

    findOne(id: number) {
        return this.productRepository.findOne({ where: { id } });
    }

    async create(dto: CreateProductDto) {
        const category = await this.categoryRepository.findOne({
            where: { id: dto.categoryId },
        });

        if (!category) {
            throw new NotFoundException("Category not found");
        }

        const product = this.productRepository.create({
            name: dto.name,
            price: dto.price,
            description: dto.description,
            category,
        });

        return await this.productRepository.save(product);
    }

    async update(id: number, dto: ProducUpdateDTO) {
        await this.productRepository.update(id, dto);
        const updated = await this.findOne(id);

        if (!updated) {
            throw new NotFoundException("Product not found");
        }

        return updated;
    }

    async delete(id: number) {
        const result = await this.productRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException("Product not found");
        }

        return { message: "Product deleted successfully" };
    }
}