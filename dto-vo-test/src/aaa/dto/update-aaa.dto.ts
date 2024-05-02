import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/mapped-types';
import { CreateAaaDto } from './create-aaa.dto';
import { XxxDto } from './xxx.dto';

// 1、PartialType 是把 dto 类型变为可选。
// export class UpdateAaaDto extends PartialType(CreateAaaDto) {}
// 2、PickType 是从中挑选几个
// export class UpdateAaaDto extends PickType(CreateAaaDto, ['name', 'email']) {}
// 3、OmitType 是从中去掉几个取剩下的。
// export class UpdateAaaDto extends OmitType(CreateAaaDto, ['name', 'hoobies', 'sex']) {}
// 4、如果有两个 dto 想合并，可以用 IntersectionType
// export class UpdateAaaDto extends IntersectionType(CreateAaaDto, XxxDto) {}

// 5、PartialType、PickType、OmitType、IntersectionType 经常会组合用，比如：
// 从 CreateAaaDto 里拿出 name 和 age 属性，从 XxxDto 里去掉 yyy 属性，将其他属性（这里是xxx）变为可选，然后两者合并。
export class UpdateAaaDto extends IntersectionType(
  PickType(CreateAaaDto, ['name', 'age']),
  PartialType(OmitType(XxxDto, ['yyy'])),
) {}
