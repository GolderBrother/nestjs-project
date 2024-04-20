import { Injectable } from '@nestjs/common';

@Injectable()
export class Lib1Service {
  getRandom() {
    return Math.random();
  }
}
