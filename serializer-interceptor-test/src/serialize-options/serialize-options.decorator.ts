import { SetMetadata } from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';

export const CLASS_SERIALIZER_OPTIONS = 'class_serializer:options';

// 往 class 或者 method 上加一个 metadata
export const SerializeOptions = (options: ClassTransformOptions) =>
  SetMetadata(CLASS_SERIALIZER_OPTIONS, options);
