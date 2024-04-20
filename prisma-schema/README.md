## prisma schema 的常用语法。

generator 部分可以指定多种生成器，比如生成 json 生成 docs 等，可以指定生成代码的位置。

datasource 是配置数据库的类型和连接 url 的。

model 部分定义和数据库表的对应关系：

@id 定义主键
@default 定义默认值
@map 定义字段在数据库中的名字
@db.xx 定义对应的具体类型
@updatedAt 定义更新时间的列
@unique 添加唯一约束
@relation 定义外键引用
@@map 定义表在数据库中的名字
@@index 定义索引
@@id 定义联合主键
此外，还可以通过 enum 来创建枚举类型。

这些就是常用的 schema 语法了。

还有一些不常用的没有列出来，大家遇去查 [schema 文档](https://www.prisma.io/docs/concepts/components/prisma-schema)就好了。

## 创建和应用数据库迁移

`npx prisma migrate dev --name abc` 是 `Prisma Migrate` 的命令，用于在开发环境中创建和应用数据库迁移。这个命令的工作原理如下：

- 生成迁移：`Prisma Migrate` 首先会检查你的 `schema.prisma` 文件，看看是否有任何新的更改。如果有，它会创建一个新的迁移文件，这个文件描述了如何将数据库从当前状态迁移到新状态。这个迁移文件会被保存在 `prisma/migrations` 目录下，文件名会包含你提供的迁移名称（在这个例子中是 "abc"）。

- 应用迁移：然后，`Prisma Migrate` 会应用这个新的迁移，将数据库迁移到新状态。这可能包括创建新表，修改现有表，或删除表，具体取决于你在 `schema.prisma` 文件中做了什么更改。

- 生成 Prisma 客户端：最后，`Prisma Migrate` 会重新生成 `Prisma` 客户端，以确保它与新的数据库模式匹配。

所以，`npx prisma migrate dev --name abc` 命令并不会全量重新生成数据库，而是根据 `schema.prisma` 文件中的更改生成和应用迁移。这意味着，如果你在 `schema.prisma` 文件中添加了一个新的 model，`Prisma Migrate` 就会生成一个新的迁移，这个迁移会在数据库中创建一个新表。如果你修改了一个现有的 model，`Prisma Migrate` 就会生成一个迁移，这个迁移会修改对应的表。