## 集成 Nest 和 Winston

在 `Logger` 实现中，我们使用 `Winston` 的 `logger`。这样可以保持 Nest 原生日志格式，同时使用自定义的日志格式。我们结合 `Dayjs` 和 `Chalk` 自定义了 `Winston` 的日志格式。

当然，打印到文件的日志依然是 `JSON` 格式的。

为了实现这个功能，我们封装了一个动态模块。在 `forRoot` 方法中传入 `options`，模块内创建 `Winston` 的 logger 实例。同时，将这个模块声明为全局模块。

这样，在应用的各个位置都可以注入我们自定义的基于 `Winston` 的 `logger` 了。
