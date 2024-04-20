import { Controller, Get } from '@nestjs/common';
import { GrpcServerService } from './grpc-server.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class GrpcServerController {
  constructor(private readonly grpcServerService: GrpcServerService) {}

  @Get()
  getHello(): string {
    return this.grpcServerService.getHello();
  }

  // 实现了 findBook 方法，并通过 @GrpcMethod 把它标识为 grpc 的远程调用的方法
  @GrpcMethod('BookService', 'FindBook')
  findBook(data: { id: number }) {
    const items = [
      {
        id: 1,
        name: '前端工程化',
        desc: '为了解决在前端开发过程中遇到的重复性工作，提高效率，保证代码质量等问题。前端工程化包括了初始化模板、模块化开发和组件化开发、项目构建和打包、自动化测试等一系列流程。工具如Webpack、Babel、Gulp、Grunt、Yeoman等都是前端工程化中常用的工具',
      },
      {
        id: 2,
        name: '前端性能优化',
        desc: '通过各种手段和技术，提高网站的加载速度，提升用户体验，提高执行效率。前端性能优化包括但不限于：减少HTTP请求、使用CDN、代码压缩和合并、使用缓存、图片优化、懒加载、减少DOM操作、CSS和JS的优化等',
      },
    ];
    const item = items.find(({ id }) => id === data.id);
    return item;
  }
}
