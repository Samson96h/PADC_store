import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './resources/auth/auth.module';
import { OrdersModule } from './resources/orders/order.module';
import { User } from './entityes/user.entity';
import { Product } from './entityes/product.entity';
import { Order } from './entityes/order.entity';
import { Category } from './entityes/category.entity';
import { ProductsModule } from './resources/products/product.module';
import { CategoryModule } from './resources/categories/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5555,
      username: 'padc_store_db_user',
      password: 'DsmEntIcKlADaDIaMWor',
      database: 'padc_store_db',
      entities: [User, Product, Order, Category],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Product, Order, Category]),
    AuthModule,
    OrdersModule,
    ProductsModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }