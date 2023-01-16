import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ProductDto {
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  description: string;
  code: string;
  stock: number;
  thumbnail: string;
}
