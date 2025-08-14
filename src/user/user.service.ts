import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity/user.entity';
import { LogsEntity } from '../logs/entities/logs.entity/logs.entity';

// 定义原始日志查询结果接口
interface RecentLogRaw {
  log_id: number;
  log_path: string;
  log_method: string;
  log_data: string;
  log_result: string;
}
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
   * @param updateUserDto 用户更新数据
   * @returns 更新后的用户
   * @throws NotFoundException 当用户不存在时
   */
  async update(updateUserDto: UpdateUserDto) {
    const user = await this.findOne(updateUserDto.id);
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

  /**
   * 查找用户日志
   * @param id 用户ID
   * @returns 用户日志列表
   * @throws NotFoundException 当用户不存在时
   */
  async findUserLogs(id: number): Promise<LogsEntity[]> {
    // const user = await this.findOne(id);
    const userLogs = await this.userRepository.findOne({
      where: { id },
      relations: ['logs'],
    });

    if (!userLogs) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return userLogs.logs || [];
  }

  /**
   * 查询用户聚合数据日志
   * @param id 用户ID
   * @returns 用户聚合数据日志
   * @throws NotFoundException 当用户不存在时
   */
  async getUserAggregatedLogs(id: number) {
    // 使用QueryBuilder获取用户基本信息和所有日志
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.logs', 'log')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // 使用QueryBuilder获取最近5条日志（已排序）
    const recentLogs = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.logs', 'log')
      .select(['log.id', 'log.path', 'log.method', 'log.data', 'log.result'])
      .where('user.id = :id', { id })
      .orderBy('log.id', 'DESC')
      .limit(5)
      .getRawMany();

    // 格式化最近日志数据
    const formattedRecentLogs = recentLogs.map((log: RecentLogRaw) => ({
      id: log.log_id || 0,
      path: log.log_path || '',
      method: log.log_method || '',
      data: log.log_data || '',
      result: log.log_result || '',
    }));

    // 聚合数据
    const aggregatedData = {
      userInfo: {
        id: user.id,
        username: user.username || '',
        email: user.email || '',
        roles: user.roles.map((role) => role.name || ''),
        profile: user.profile,
      },
      logsCount: user.logs.length,
      logs: user.logs.map((log: LogsEntity) => ({
        id: log.id || 0,
        path: log.path || '',
        method: log.method || '',
        data: log.data || '',
        result: log.result || '',
      })),
      // 最近5条日志（通过QueryBuilder查询并排序）
      recentLogs: formattedRecentLogs,
    };

    return aggregatedData;
  }

  /**
   * 查找用户个人信息
   * @param id 用户ID
   * @returns 用户个人信息
   * @throws NotFoundException 当用户不存在时
   */
  async findUserProfile(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }
}
