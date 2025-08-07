import { Body, Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles, RolesGuard } from 'src/gusrds/roles.guard';
import { AuthGuard } from 'src/gusrds/auth.guard';


@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Roles('admin', 'manager')
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Roles('admin', 'manager')
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @Roles('admin')
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.usersService.delete(id);
    }
}