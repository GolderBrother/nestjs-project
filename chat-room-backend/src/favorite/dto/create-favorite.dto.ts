import { IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @IsNotEmpty({
    message: 'chatHistoryId不能为空',
  })
  chatHistoryId: number;
}
