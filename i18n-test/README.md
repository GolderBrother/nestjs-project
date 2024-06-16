# Nest 如何实现国际化？

当你的应用需要支持多种语言环境的用户访问时，就要做国际化。

前端要做界面的国际化，后端也同样要做返回的信息的国际化。

nest 里我们用 nestjs-i18n 这个包，在 AppModule 里引入 I18nModule，指定资源包的路径，resolver（取 lang 配置的方式）。

然后就可以注入 I18nSerive，用它的 t 方法来取资源包中的文案了。

dto 的国际化需要全局启用 I18nValidationPipe 和 I18nValidationExceptionFilter，然后把 message 换成资源包的 key 就好了。

文案支持占位符，可以在资源包里写 {xxx} 然后用的时候传入 xxx 的值。

如果你做一个面向多种语言用户的网站，那么国际化功能是必不可少的。