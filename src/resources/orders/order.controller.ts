import { Controller, Post, Body, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { AuthGuard } from 'src/gusrds/auth.guard';
import { RolesGuard, Roles } from 'src/gusrds/roles.guard';
import { AuthUser } from 'src/decorators/auth-user.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Roles('user', 'admin', 'manager')
    @Post()
    createOrder(@Body() dto: OrderDto, @AuthUser() user: { id: number }) {
        return this.ordersService.create(dto, user.id);
    }

    @Roles('user', 'admin', 'manager')
    @Get('my')
    getMyOrders(@AuthUser() user: { id: number }) {
        return this.ordersService.findByUser(user.id);
    }

    @Roles('admin')
    @Get()
    getAllOrders() {
        return this.ordersService.findAll();
    }

    @Roles('admin')
    @Get(':id')
    getOrderById(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findOne(id);
    }
}