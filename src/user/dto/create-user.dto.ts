import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * 创建用户数据传输对象
 */
export class CreateUserDto {
  /**
   * 用户名
   * @example 'johndoe'
   */
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * 密码
   * 至少6个字符
   * @example 'password123'
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  /**
   * 电子邮箱
   * @example 'john@example.com'
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
