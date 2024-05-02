import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class CreateAaaDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsBoolean()
  sex: boolean;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  hoobies: string[];
}
