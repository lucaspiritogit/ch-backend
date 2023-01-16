import { Controller, Get, Post, Delete, Put, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { HttpException, HttpStatus, Param } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() product: Product) {
    if (!product.title) {
      throw new HttpException('Title is required', HttpStatus.BAD_REQUEST);
    }
    if (!product.price) {
      throw new HttpException('Price is required', HttpStatus.BAD_REQUEST);
    }
    return this.productService.create(product);
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    if (!id) {
      throw new HttpException('Id is required', HttpStatus.BAD_REQUEST);
    }

    if (!isValidObjectId(id)) {
      throw new HttpException('Id is invalid', HttpStatus.BAD_REQUEST);
    }

    const product: Product = await this.productService.getProductById(id);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Delete(':id')
  async deleteProductById(@Param('id') id: string): Promise<Product> {
    if (!id) {
      throw new HttpException('Id is required', HttpStatus.BAD_REQUEST);
    }

    if (!isValidObjectId(id)) {
      throw new HttpException('Id is invalid', HttpStatus.BAD_REQUEST);
    }

    const product: Product = await this.productService.deleteProductById(id);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Put(':id')
  async updateProductById(
    @Param('id') id: string,
    @Body() product: Product,
  ): Promise<Product> {
    if (!id) {
      throw new HttpException('Id is required', HttpStatus.BAD_REQUEST);
    }

    if (!isValidObjectId(id)) {
      throw new HttpException('Id is invalid', HttpStatus.BAD_REQUEST);
    }

    const productUpdated: Product = await this.productService.updateProductById(
      id,
      product,
    );

    return productUpdated;
  }
}
