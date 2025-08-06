import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建新用户
   * @param createUserDto 用户创建数据
   * @returns 创建的用户
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(createUserDto);
  }

  /**
   * 获取所有用户
   * @returns 用户列表
   */
  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  /**
   * 获取指定ID的用户
   * @param id 用户ID
   * @returns 用户信息
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOne(+id);
  }

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param updateUserDto 用户更新数据
   * @returns 更新后的用户
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.update(+id, updateUserDto);
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 删除结果
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.remove(+id);
  }
}
