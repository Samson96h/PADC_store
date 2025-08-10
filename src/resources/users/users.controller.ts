import { Controller, Get, Param,Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles, RolesGuard } from 'src/gusrds/roles.guard';
import { AuthGuard } from 'src/gusrds/auth.guard';
import { IdDTO } from 'src/dto/id-param.dto';
import { UserRole } from 'src/entities/enums/role.enum';


@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Roles(UserRole.ADMIN,UserRole.MANAGER)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Roles(UserRole.ADMIN,UserRole.MANAGER)
    @Get(':id')
    findOne(@Param() param: IdDTO) {
        return this.usersService.findOne(param.id);
    }

    @Roles(UserRole.ADMIN)
    @Delete(':id')
    delete(@Param() param: IdDTO) {
        return this.usersService.delete(param.id);
    }
}