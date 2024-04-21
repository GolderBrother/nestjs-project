# GraphQL + Primsa + React 实现 TodoList

实现了 Restful 和 GraphQL 版的 CRUD。

前端用 React + @apollo/client。

后端用 Nest + GraphQL + Prisma + MySQL。

GraphQL 主要是定义 schema 和 resolver 两部分，schema 是 Query、Mutation 的结构，resolver 是它的实现。

可以在 playground 里调用接口，也可以在 react 里用 @appolo/client 调用。

相比 restful 的版本，graphql 只需要一个接口，然后用查询语言来查，需要什么数据取什么数据，更加灵活。