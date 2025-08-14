import {
  IsNumber,
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
} from 'class-validator';

/**
 * 更新用户数据传输对象
 */
export class UpdateUserDto {
  /**
   * 用户ID
   */
  @IsNumber()
  id: number;

  /**
   * 用户名
   * @example 'johndoe'
   */
  @IsString()
  @IsOptional()
  username?: string;

  /**
   * 密码
   * 至少6个字符
   * @example 'newpassword123'
   */
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  /**
   * 电子邮箱
   * @example 'john@example.com'
   */
  @IsEmail()
  @IsOptional()
  email?: string;
}
