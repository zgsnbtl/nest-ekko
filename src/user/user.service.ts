import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * 查找所有用户
   * @returns 用户列表
   */
  findAll() {
    return this.userRepository.find({
      relations: ['roles', 'logs'],
    });
  }

  /**
   * 根据ID查找用户
   * @param id 用户ID
   * @returns 用户信息
   * @throws NotFoundException 当用户不存在时
   */
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'logs'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * 创建新用户
   * @param createUserDto 用户创建数据
   * @returns 创建的用户
   */
  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param updateUserDto 用户更新数据
   * @returns 更新后的用户
   * @throws NotFoundException 当用户不存在时
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 删除结果
   * @throws NotFoundException 当用户不存在时
   */
  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
