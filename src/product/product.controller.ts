import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.model';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() product: Product) {
    this.productService.create(product);
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }
}
