# nest repl 模式

我们写过很多 Module、Service、Controller，但这些都要服务跑起来之后在浏览器里访问对应的 url，通过 get 或者 post 的方式传参来测试。

这个还是挺麻烦的，能不能像 node 的 `repl` 那样，直接在控制台测试呢？

`repl` 是 `read-eval-paint-loop`，主要是用来调试 `service` 多一些，有点类似内嵌在终端里面的接口客户端，也就是这个：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/014ac7622cb0491e9c0a048074987abd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=566&h=482&s=20506&e=webp&b=010101)

Nest 能不能这样来测试呢？

可以的，Nest 支持 repl 模式。

我们创建个 Nest 项目：

```bash
nest new repl-test
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1786c4742504811ad11a6de79107b6b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=642&s=65450&e=webp&b=020202)

然后创建两个模块：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab99292681cb44e2893c9fbc9beef0c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=926&h=1016&s=121248&e=webp&b=191919)

把服务跑起来：

```bash
npm run start:dev
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfdce32a00754b879688e3ad29ee4166~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1704&h=994&s=197436&e=webp&b=191818)

浏览器访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5efec6799b0c4ae9a348c8b7e4342ae3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=600&h=182&s=9140&e=webp&b=fdfdfd)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d474de33e92742538027e78b11ccaa60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=604&h=204&s=9682&e=webp&b=fefefe)

我们前面都是这么测试接口的。

其实还可以用 repl 模式。

在 src 下创建个 repl.ts，写入如下内容：

```javascript
import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await repl(AppModule);
}
bootstrap();
```

然后把服务停掉，通过这种方式跑：

```bash
npm run start:dev -- --entryFile repl
```

这里的 --entryFile 是指定入口文件是 repl.ts

前面带了个 -- 是指后面的参数不是传给 npm run start:dev 的，要原封不动保留。

也就是会传给 nest start

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cd8ddbb3564412bbeedb5cd2c8eb7fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=690&h=114&s=13822&e=webp&b=21201f)

当然，你直接执行 nest start 也可以：

```css
nest start --watch --entryFile repl
```

跑起来后，执行 debug()，会打印所有的 module 和 module 下的 controllers 和 providers。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a06450d912f4b6dbe0489d4b8cb7c07~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=588&h=794&s=34604&e=webp&b=191919)

而且，你可以 get() 来取对应的 providers 或者 controllers 调用：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71258c8a3ca04eda9ad3ae423d581de7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=698&s=38530&e=webp&b=1d1d1d)

get、post 方法都可以调用。

有的同学说，你这个 post 方法没有参数啊。

那我们加一些：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e3c6bac0d7044e9b829e2ab5f9d40c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=690&h=286&s=13878&e=webp&b=202020)

然后添加 ValidationPipe：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb80a8150df7469f9e02fe8d72338fc8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=612&s=40136&e=webp&b=202020)

安装校验相关的包：

```bash
npm install class-validator class-transformer
```

在 dto 添加约束：

```javascript
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAaaDto {
    @IsNotEmpty()
    aaa: string;

    @IsEmail()
    bbb: string;
}
```

我们先正常跑下服务：

```bash
npm run start:dev
```

然后 postman 里测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31b20397c126456daccb1699e3e2ffba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=788&h=838&s=28420&e=webp&b=fcfcfc)

可以看到，ValidationPipe 生效了。

那 repl 里是不是一样呢？

我们再跑下 repl 模式：

```bash
npm run start:dev -- --entryFile repl
```

可以看到，并没有触发 pipe：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7fa841d45514ab5bccb2dc65544b2d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=804&s=67544&e=webp&b=1b1b1b)

也就是说，它只是单纯的传参调用这个函数，不会解析装饰器。

所以测试 controller 的话，repl 的方式是有一些限制的。

但是测试 service 很不错：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dcf511fad2c4db39c5f5433eecee304~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=644&h=214&s=12844&e=webp&b=191919)

比如测试某个项目的 UserService 的 login 方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/278c4eee6528463da14fe18536ddb5fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1534&h=1422&s=226560&e=webp&b=191919)

就很方便。

大概知道 repl 模式是做啥的之后，我们过一下常用的 api：

debug() 可以查看全部的 module 或者某个 module 下的 cotrollers、providers：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c8ddb4e7c084d4091af9f1cacd8261f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=466&h=644&s=25870&e=webp&b=191919)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4547af50d2b64022841207c9e8b7dce9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=426&h=296&s=13536&e=webp&b=191919)

methods() 可以查看某个 controller 或者 provider 的方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72463ae94db940e78f56024bab48397d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=530&h=338&s=12266&e=webp&b=181818)

get() 或者 $() 可以拿到某个 controller 或者 provider 调用它的方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a6a9c983c994f69946fa96d647f644b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=288&s=22844&e=webp&b=191919)

常用的 api 就这些。

此外，按住上下键可以在历史命令中导航：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/425c436b4fac4f4689d49fdbc8ea959c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1234&h=718&s=36652&e=webp&f=11&b=181818)

但有个问题。

当你重新跑之后，这些命令历史就消失了，再按上下键也没有历史。

可以改一下 repl.ts：

```javascript
import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const replServer = await repl(AppModule);
    replServer.setupHistory(".nestjs_repl_history", (err) => {
        if (err) {
            console.error(err);
        }
    });
}
bootstrap();
```

再跑的时候也是有历史的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c49f23d4ffb4599b47766ba247dcb5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1572&h=764&s=156100&e=webp&f=30&b=181818)

其实就是 nest 会把历史命令写入文件里，下一次跑就可以用它恢复历史了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fda1a3a30a24dd48ad05428a0b94854~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=482&h=272&s=11414&e=webp&b=202020)

你还可以把这个命令配到 `npm scripts` 里：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a422498fc74346248eb77103b21870a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=114&s=13534&e=webp&b=212020)

然后直接 `npm run repl:dev` 来跑。

## 总结

这节我们学了 nest 的 repl 模式。

repl 模式下可以直接调用 controller 或者 provider 的方法，但是它们并不会触发 pipe、interceptor 等，只是传参测试函数。

可以使用 debug() 拿到 module、controller、provider 的信息，methods() 拿到方法，然后 get() 或者 $() 拿到 controller、provider 然后调用。

repl 模式对于测试 service 或者 controller 的功能还是很有用的。