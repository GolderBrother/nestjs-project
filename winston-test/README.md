# Node 里用 Winston 打印日志

Node 服务端我们不会用 console.log 打印日志，而是会用日志框架，比如 winston。

winston 支持 transport 配置，可以把日志传输到 console、file、通过 http 发送到别的服务，写入 mongodb 数据库等。

社区有很多 transport 可用，我们尝试了滚动日志的 transport，可以根据日期来自动分割日志文件。

winston 还支持 level 配置，可以根据级别来过滤日志。

而且还支持 format 的设置，比如 json、simple、label、timstamp 等，一般我们输出到文件里的都是 json 格式，并且给他加上时间戳和 label，这样方便之后分析。

每个 transport 都可以单独指定 format，而且还可以创建多个 logger，每个 logger 用不同的配置。

此外，winston 还支持指定未捕获的 error 的日志怎么处理。

总之，相比直接 console.log，用 winston 这样的灵活强大的日志框架可太香了。