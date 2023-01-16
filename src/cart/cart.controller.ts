import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { ProductService } from 'src/product/product.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  @Post()
  create(@Body() cart: Cart) {
    return this.cartService.create(cart);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Put(':id')
  async addProductToCart(@Param('id') id: string, @Body() product: any) {
    if (!(await this.productService.getProductById(product._id))) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    console.log(await this.productService.getProductById(product._id));
    return this.cartService.pushProductIntoCart(id, product);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
