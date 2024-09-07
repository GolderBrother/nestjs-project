import Nacos from 'nacos'
const nacos = new Nacos.NacosNamingClient({
    serverList: ['127.0.0.1:8848'],
    namespace: 'public',
    logger: console
})

await nacos.ready();

// 服务发现，获取实例列表
const instances = await nacos.getAllInstances('aaaService');
console.log('instances', instances)