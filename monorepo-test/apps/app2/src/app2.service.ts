import { Lib1Service } from '@app/lib1';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class App2Service {
  @Inject(Lib1Service)
  private lib1Service: Lib1Service;
  getHello(): string {
    return 'Hello World! app2';
  }

  bbb(): string {
    return 'bbb' + this.lib1Service.getRandom();
  }
}
