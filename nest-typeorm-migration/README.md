# Nest 项目里如何使用 TypeORM 迁移
生产环境是通过 migration 来创建表、更新表结构、初始化数据的。

我们在 nest 项目里实现了下迁移。

大概有这几步：

创建 data-source.ts 供 `migration` 用
把 `synchronize` 关掉
用 `migration:generate` 生成创建表的 `migration`
用 `migration:run` 执行
用 `migration:create` 创建 `migration`，然后填入数据库导出的 sql 里的 insert into 语句
用 `migration:run` 执行
用 `migration:generate` 生成修改表的 `migration`
用 `migration:run` 执行
在生产环境下，我们就是这样创建表、更新表、初始化数据的