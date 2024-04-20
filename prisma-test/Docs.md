整个流程：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63dbcba51cca4de4b37da140ea4a5dd7~tplv-k3u1fbpfcp-jj-mark:2722:0:0:0:q75.awebp#?w=1666&h=632&s=58044&e=png&b=ffffff)

只是把 `entity` 类变成了 `DSL` 语法里的 `model`，然后通过编译的方式生成 `client` 的代码，之后进行 `CRUD。`


ORM 框架 prisma，它和 `typeorm` 大同小异。

`typeorm` 是把表映射成 `entity` 类，然后调用 `repository` 的 `api` 来做 `CRUD`。

`prisma` 是把条映射成 `schema` 的 `model`，然后编译生成 client 代码，之后进行 `crud`。

用到这两个命令：

`primsa init` 创建 `schema` 文件

`prisma migrate dev` 根据 `schema` 文件生成 `sql` 并执行，还会生成 `client` 代码。

之后就是 `CRUD` 了，涉及到 `findMany、create、delete、update `等 `api`。