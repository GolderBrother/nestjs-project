# passport 实现 GitHub 三方账号登录

## 背景

很多网站都支持三方登录，这样，不用每次都输入用户名密码，可以用别的账号来登录。

我们基于 passport 的 GitHub 策略实现了三方登录。

它核心就是要获取 clientID、clientSecret。

然后在 GithubStrategy 的构造函数传入这些信息，在 validate 方法里就可以拿到返回的 profile。

我们只要在用户表存一个 githubId 的字段，用 github 登录之后根据 id 查询用户信息，实现登录就好了。

这样就免去了每次登录都输入用户名密码的麻烦。