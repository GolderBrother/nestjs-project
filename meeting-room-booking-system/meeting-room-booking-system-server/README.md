完成阿里云的部署

写了 docker-compose.yml 和 Nest 应用的 Dockerfile，在本地用 docker compose 跑没问题。

然后服务器上也是用同样的方式跑。

买了一台阿里云服务器，安装 git 来下载项目代码，然后安装 docker compose 把服务跑起来就行了。

部署成功之后，我们的服务就可以在世界各地访问了。

06-27：
这节我们实现了 migration 数据迁移，也就是创建表、初始化数据。

在生产环境会把 synchronize 关掉，然后跑 migration。

我们用 migration:generate 生成了 create table 的 migration。

然后用 migration:create 生成了空的 migration，填入了导出的 inert 语句。

执行完这两个 migration 之后，表和数据就都有了，就可以跑 Nest 项目了。

线上项目，都是这样用手动跑 migration 的方式来修改表的。