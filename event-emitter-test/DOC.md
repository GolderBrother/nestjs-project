# Nest 里如何实现事件通信？

多个业务模块之间可能会有互相调用的关系，但是也不方便直接注入别的业务模块的 Service 进来。

这种就可以通过 EventEmitter 来实现。

在一个 service 里 emit 事件和 data，另一个 service 里 @OnEvent 监听这个事件就可以了。

用起来很简单，但比起注入别的模块的 service 方便太多了。