import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user.entity/user.entity';
@Entity()
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  gender: number;
  @Column()
  address: string;
  @Column()
  photo: string;
  // 导入 OneToOne 装饰器和 JoinColumn 装饰器
  // 确保 UserEntity 已正确导入
  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
