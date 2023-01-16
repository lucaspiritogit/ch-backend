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
import { ProductService } from 'src/product/product.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  @Post()
  create(@Body() cart: CreateCartDto) {
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

  @Put(':id/:productId')
  async removeProductFromCart(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    if (!(await this.productService.getProductById(productId))) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return this.cartService.removeProductFromCart(id, productId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
