import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './product/product.model';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://lpirito:coderhouse4783@cluster0.6phuwde.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [AppController, ProductController],
  providers: [AppService, ProductService],
})
export class AppModule {}
