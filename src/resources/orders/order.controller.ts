import { Controller, Post, Body, UseGuards, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { OrdersService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { AuthGuard } from 'src/gusrds/auth.guard';
import { RolesGuard, Roles } from 'src/gusrds/roles.guard';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { IdDTO } from 'src/dto/id-param.dto';
import { UserRole } from 'src/entities/enums/role.enum';
import { User } from 'src/entities/user.entity';

@UseGuards(AuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    async createOrder(@Body() orderDto: OrderDto,@AuthUser() user: User) {
        return this.ordersService.create(orderDto, user);
    }


    @Roles(UserRole.USER, UserRole.MANAGER, UserRole.ADMIN)
    @Get('my')
    getMyOrders(@AuthUser() user: { id: number }) {
        return this.ordersService.findByUser(user.id);
    }

    @Roles(UserRole.ADMIN)
    @Get()
    getAllOrders() {
        return this.ordersService.findAll();
    }

    @Roles(UserRole.ADMIN)
    @Get(':id')
    getOrderById(@Param() param: IdDTO) {
        return this.ordersService.findOne(param.id);
    }
}