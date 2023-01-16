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
    try {
      const newProduct = new this.productModel(product);
      return await newProduct.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductById(id: string): Promise<Product> {
    if (!this.productModel.exists({ _id: id })) {
      throw new Error('Product not found');
    }
    return await this.productModel.findById({ _id: id }).exec();
  }

  async deleteProductById(id: string): Promise<Product> {
    return await this.productModel.findByIdAndDelete({ _id: id }).exec();
  }

  async updateProductById(id: string, product: Product): Promise<Product> {
    return await this.productModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: product,
      },
      {
        new: true,
      },
    );
  }
}
