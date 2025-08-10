import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './resources/auth/auth.module';
import { OrdersModule } from './resources/orders/order.module';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { Category } from './entities/category.entity';
import { ProductsModule } from './resources/products/product.module';
import { CategoryModule } from './resources/categories/category.module';
import { ConfigModule } from '@nestjs/config';
import { SecretCode } from './entities/secret.entiy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5555,
      username: 'padc_store_db_user',
      password: 'DsmEntIcKlADaDIaMWor',
      database: 'padc_store_db',
      entities: [User, Product, Order, Category,SecretCode],
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