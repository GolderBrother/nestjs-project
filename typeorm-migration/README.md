# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command

## 用 TypeORM 的 migration 迁移功能

开发环境我们会用 synchronize 来同步 Entity 和数据库表，它会自动执行 create table、alter table，不用手动修改表结构，很方便。

但是它并不安全，因为很容易丢失数据。所以生产环境下我们会把它关掉，用 migration 来管理。

migration 就是把 create table、alter table 等封装成一个个的 migration，可以一步步执行、也可以一步步撤销回去。

有 4 个常用命令：

migration:create：生成空白 migration 文件
migration:generate：连接数据库，根据 Entity 和数据库表的差异，生成 migration 文件
migration:run：执行 migration，会根据数据库 migrations 表的记录来确定执行哪个
migration:revert：撤销上次 migration，删掉数据库 migrations 里的上次执行记录
这样就把生产环境里的建表和修改表的操作管理了起来
