import { Controller, Get, Post, Delete, Put, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { HttpException, HttpStatus, Param } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() product: ProductDto) {
    return this.productService.create(product);
  }

  @Get()
  async getAllProducts(): Promise<ProductDto[]> {
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
