# 基于 Redis 实现关注关系

我们实现了下关注、被关注、互相关注。

在 mysql 里用中间表来存储 user 和 user 的关系，在 TypeORM 里用 @ManyToMany 映射。

互相关注用 redis 的 Set 来实现，先把 user 的 followers 和 following 存储到集合中。

然后把两个集合的交集求出来放入一个新的集合。

这样就能求出互相关注的关系。

当有新的关注或者取消关注时，除了要更新数据库外，也要顺便更新下 redis。