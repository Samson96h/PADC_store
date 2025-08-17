import { IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CategoryDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}