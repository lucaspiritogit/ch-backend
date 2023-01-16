import { Injectable } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

  create(cart: Cart) {
    const newCart = new this.cartModel(cart);
    return newCart.save();
  }

  findAll() {
    return this.cartModel.find().exec();
  }

  findOne(id: string) {
    return this.cartModel.findById(id).exec();
  }

  pushProductIntoCart(id: string, product: any) {
    return this.cartModel
      .findByIdAndUpdate({ _id: id }, { $push: { products: product } })
      .exec();
  }

  remove(id: string) {
    return this.cartModel.findByIdAndDelete({ _id: id }).exec();
  }
}
