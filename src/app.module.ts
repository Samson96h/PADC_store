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
import { OrderInfo } from './entities/order-info.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AllPhotos } from './entities/photos-entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/'),
      serveRoot: '/public/',
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +(process.env.DATABASE_PORT as string),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Product, Order, Category,SecretCode,OrderInfo,AllPhotos],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Product, Order, Category,OrderInfo,AllPhotos]),
    AuthModule,
    OrdersModule,
    ProductsModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}