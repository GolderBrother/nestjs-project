import { Lib1Service } from '@app/lib1';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  @Inject(Lib1Service)
  private lib1Service: Lib1Service;

  getHello(): string {
    return 'Hello World! app1';
  }

  aaa(): string {
    return 'aaa' + this.lib1Service.getRandom();
  }
}
