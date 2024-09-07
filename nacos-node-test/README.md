#  nacos 作为配置中心、注册中心的用法

作为注册中心就是注册服务的实例，比如 aaaService 有多个服务实例的时候，可以分别用 registerService、deregisterInstance、getAllInstances、subscribe 实现新增、删除、查询、监听。

作为配置中心就是管理配置，可以分别用 publishSingle、remove、getConfig、subscribe 实现新增（修改）、删除、查询、监听