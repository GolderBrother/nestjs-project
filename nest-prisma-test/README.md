# Prisma 和 Nest 的集成。

先用 `prisma init` 创建 `schema` 文件，然后修改 `model` 后用 `prisma migrate dev` 同步到数据库和生成 `client` 代码。

只不过之后使用 `client` 代码的方式不同。

我们创建了个 `Service` 继承 `PrismaClient`，在 `constructor` 里设置初始化参数。

之后把这个 `service` 的实例注入到别的 `service` 里，就可以做 `CRUD` 了。