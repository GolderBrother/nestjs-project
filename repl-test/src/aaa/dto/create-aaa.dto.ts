import { IsNotEmpty } from 'class-validator';

export class CreateAaaDto {
  @IsNotEmpty({
    message: 'aaa不能为空',
  })
  aaa: string;
  @IsNotEmpty({
    message: 'bbb不能为空',
  })
  bbb: string;
}
