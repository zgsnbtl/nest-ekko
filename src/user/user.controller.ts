import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity/user.entity';
import { LogsEntity } from '../logs/entities/logs.entity/logs.entity';
import { ProfileEntity } from './entities/profile.entity/profile.entity';
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
  @Post('/update')
  update(@Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.userService.update(updateUserDto);
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

  /**
   * 获取用户日志
   * @param id 用户ID
   * @returns 用户日志列表
   */
  @Get('/logs/:id')
  findUserLogs(@Param('id') id: string): Promise<LogsEntity[]> {
    return this.userService.findUserLogs(+id);
  }

  /**
   * 查询用户聚合数据日志
   * @param id 用户ID
   * @returns 用户聚合数据日志
   */
  @Get('/aggregated-logs/:id')
  getUserAggregatedLogs(@Param('id') id: string): Promise<{
    userInfo: {
      id: number;
      username: string;
      email: string;
      roles: string[];
      profile: ProfileEntity | null;
    };
    logsCount: number;
    logs: Array<{
      id: number;
      path: string;
      method: string;
      data: string;
      result: string;
    }>;
    recentLogs: Array<{
      id: number;
      path: string;
      method: string;
      data: string;
      result: string;
    }>;
  }> {
    return this.userService.getUserAggregatedLogs(+id);
  }
}
