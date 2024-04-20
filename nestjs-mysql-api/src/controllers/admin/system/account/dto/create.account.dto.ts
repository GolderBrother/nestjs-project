import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ required: true, description: '项目名称' })
  @IsString({ message: '项目名称必须为字符类型' })
  @IsNotEmpty({ message: '项目名称不能为空' })
  readonly ch_name: string;

  @ApiProperty({ required: true, description: '密码' })
  @IsString({ message: '密码必须为字符串类型' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;

  @ApiPropertyOptional({ required: false, description: '选中角色的id字符串,以英文,拼接' })
  @IsString({ message: '必须是字符类' })
  @IsOptional()
  readonly roles?: string;
}