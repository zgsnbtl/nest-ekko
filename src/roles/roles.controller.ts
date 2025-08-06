import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleEntity } from './entities/role.entity/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(
    @Body()
    createRoleDto: {
      name: string;
      description?: string;
      isActive?: boolean;
    },
  ): Promise<RoleEntity> {
    return await this.rolesService.createRole(createRoleDto);
  }

  @Get()
  async findAllRoles(): Promise<RoleEntity[]> {
    return await this.rolesService.findAllRoles();
  }

  @Get(':id')
  async findRoleById(@Param('id') id: string): Promise<RoleEntity | null> {
    return await this.rolesService.findRoleById(+id);
  }

  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body()
    updateRoleDto: {
      name?: string;
      description?: string;
      isActive?: boolean;
    },
  ): Promise<RoleEntity | null> {
    return await this.rolesService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<boolean> {
    return await this.rolesService.deleteRole(+id);
  }
}
