import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async createRole(roleData: {
    name: string;
    description?: string;
    isActive?: boolean;
  }): Promise<RoleEntity> {
    const role = new RoleEntity();
    role.name = roleData.name;
    role.description = roleData.description || '';
    role.isActive = roleData.isActive ?? true;
    return await this.roleRepository.save(role);
  }

  async findAllRoles(): Promise<RoleEntity[]> {
    return await this.roleRepository.find();
  }

  async findRoleById(id: number): Promise<RoleEntity | null> {
    return await this.roleRepository.findOneBy({ id });
  }

  async updateRole(
    id: number,
    roleData: {
      name?: string;
      description?: string;
      isActive?: boolean;
    },
  ): Promise<RoleEntity | null> {
    const role = await this.findRoleById(id);
    if (!role) return null;

    if (roleData.name !== undefined) role.name = roleData.name;
    if (roleData.description !== undefined)
      role.description = roleData.description;
    if (roleData.isActive !== undefined) role.isActive = roleData.isActive;

    return await this.roleRepository.save(role);
  }

  async deleteRole(id: number): Promise<boolean> {
    const result = await this.roleRepository.delete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }
}
