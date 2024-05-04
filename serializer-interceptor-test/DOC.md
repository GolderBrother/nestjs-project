# 手写序列化 Entity 的拦截器

使用 entity 结合 class-transformer 的装饰器和 ClassSerializerInterceptor 拦截器实现复用 entity 做 vo 的功能。

首先是 @SerializeOptions 装饰器，它就是在 class 或者 handler 上加一个 metadata，存放 class-transformer 的 options。

在 ClassSerializerInterceptor 里用 reflector 把它取出来。

然后拦截响应，用 map operator 对响应做变换，调用 classTransformer 包的 instanceToPlain 方法进行转换。

自己实现一遍之后，对它的理解就更深了。