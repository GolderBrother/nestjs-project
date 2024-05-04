import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassTransformOptions } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { CLASS_SERIALIZER_OPTIONS } from 'src/serialize-options/serialize-options.decorator';
import * as classTransformer from 'class-transformer';
import { isObject } from 'src/utils';

@Injectable()
export class ClassSerializerInterceptor implements NestInterceptor {
  @Inject(Reflector)
  protected readonly reflector: Reflector;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextOptions = this.getContextOptions(context);
    console.log('contextOptions', contextOptions);
    return (
      next
        .handle()
        // 用 map operator 对响应做修改。
        .pipe(
          map((res) => {
            return this.serialize(res, contextOptions);
          }),
        )
    );
  }
  serialize(
    response: Record<string, any> | Array<Record<string, any>>,
    options: ClassTransformOptions,
  ) {
    // 这里排除了 response 不是对象的情况和返回的是文件流的情况
    if (!isObject(response) || response instanceof StreamableFile) {
      return response;
    }
    // 根据响应是数组还是对象分别做处理，调用 transformToNewPlain 做转换。
    return Array.isArray(response)
      ? response.map((item) => this.transformToNewPlain(item, options))
      : this.transformToNewPlain(response, options);
  }

  transformToNewPlain(plainOrClass: any, options: ClassTransformOptions) {
    if (!plainOrClass) {
      return plainOrClass;
    }

    // 用 class-transformer 包的 instanceToPlain 根据对象的 class 上的装饰器来创建新对象
    const newPlain = classTransformer.instanceToPlain(plainOrClass, options);
    return newPlain;
  }

  protected getContextOptions(
    context: ExecutionContext,
  ): ClassTransformOptions | undefined {
    // 用它的 getAllAndOverride 方法拿到 class 或者 handler 上的 metadata
    return this.reflector.getAllAndOverride(CLASS_SERIALIZER_OPTIONS, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
