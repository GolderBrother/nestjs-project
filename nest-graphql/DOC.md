# Nest 开发 GraphQL 服务：实现 CRUD

什么是 graphql，它就是通过模式定义语言 SDL（Schema Definition Language) 定义对象和对象之间关系的 schema：

在 Nest 里集成了 GraphQL，并做了 CRUD。

graphql 主要是分为 schema、resolver 两部分。

GraphQLModule.forRoot 指定 typePaths 也就是 schema 文件的位置。

然后用 nest g resolver 生成 resolver 文件，实现 Query、Mutaion 的方法。

并且还可以切换 playground 为 apollo 的。

之后就可以在 palyground 里发送 graphql 请求，做 CRUD 了。