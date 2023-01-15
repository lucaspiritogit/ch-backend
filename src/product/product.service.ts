import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async create(product: Product): Promise<Product> {
    const newProduct = new this.productModel(product);
    return await newProduct.save();
  }
}
