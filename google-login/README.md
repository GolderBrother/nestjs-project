# passport 实现 Google 三方账号登录

用 google 账号登录之后，会让你完善一些信息，然后 create count。

也就是基于你 google 账号里的东西，再让你填一些东西之后，完成账号注册。

之后你 google 登录，就会查到这个账号，从而直接登录，不用输密码

我们实现了基于 google 的三方账号登录。

首先搜索对应的 passport 策略，然后生成 client id 和 client secret。

在 nest 项目里使用这个策略，添加登录和 callback 的路由。

之后基于 google 返回的信息来自动注册，如果信息不够，可以重定向到一个 url 让用户填写其余信息。

之后再次用这个 google 账号登录的话，就会自动登录。