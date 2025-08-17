import { IsOptional, IsString, IsNumber, MaxLength, Min, IsBoolean } from 'class-validator';

export class ProducUpdateDTO {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
  
  @IsBoolean()
  removeOldPhotos?: boolean;
}