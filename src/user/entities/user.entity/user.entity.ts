/**
 * 用户实体文件
 * 定义了用户表的结构和关系
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { LogsEntity } from '../../../logs/entities/logs.entity/logs.entity';
import { RoleEntity } from '../../../roles/entities/role.entity/role.entity';

/**
 * 用户实体类
 * 映射到数据库中的user表
 */
@Entity()
export class UserEntity {
  /**
   * 用户ID
   * 主键，自动生成
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 用户名
   * 用户登录时使用的唯一标识符
   */
  @Column()
  username: string;

  /**
   * 密码
   * 用户登录密码（加密存储）
   */
  @Column()
  password: string;

  /**
   * 电子邮箱
   * 用户的联系邮箱，用于登录验证和通知
   */
  @Column()
  email: string;

  /**
   * 日志记录
   * 一对多关系，一个用户可以有多条操作日志
   */
  @OneToMany(() => LogsEntity, (logs) => logs.user)
  logs: LogsEntity[];

  /**
   * 用户角色
   * 多对多关系，一个用户可以有多个角色，一个角色可以分配给多个用户
   */
  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: RoleEntity[];
}
