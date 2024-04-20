# prisma 的全部命令：

- init：创建 schema 文件

- generate： 根据 shcema 文件生成 client 代码

- db：同步数据库和 schema

- migrate：生成数据表结构更新的 sql 文件

- studio：用于 CRUD 的图形化界面

- validate：检查 schema 文件的语法错误

- format：格式化 schema 文件

- version：版本信息

其中，`prisma init、prisma migrate dev` 是最常用的。

`prisma db pull、prisma db push` 也可以方便的用来做 `schema` 和数据库的同步。