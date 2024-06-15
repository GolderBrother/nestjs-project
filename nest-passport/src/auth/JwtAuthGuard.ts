import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/auth/is-public/is-public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // @ts-ignore
  canActivate(context: ExecutionContext):  boolean | Promise<boolean> | Observable<boolean> {
    // 实现就是从目标 controller、handler 上取 public 的 meatadata，如果有就直接放行，否则才做认证。
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(), // for global guards
    ]);

    // 如果是公共接口，不需要认证，直接放行
    if (isPublic) {
      return true;
    }
    // 否则需要认证
    return super.canActivate(context);
  }
}
