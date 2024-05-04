# 聊天室项目：用户注册

创建了 nest 项目，并引入了 prisma 和 redis。

通过 prisma 的 migrate 功能，生成迁移 sql 并同步到数据库。

此外，prisma 会生成 client 的代码，我们封装了 PrismaService 来做 CRUD。

我们实现了 /user/register 和 /user/register-captcha 两个接口。

/user/register-captcha 会向邮箱地址发送一个包含验证码的邮件，并在 redis 里存一份。

/user/register 会根据邮箱地址查询 redis 中的验证码，验证通过会把用户信息保存到表中。

这样，注册功能就完成了。