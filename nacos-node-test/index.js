import Nacos from 'nacos'

const client = new Nacos.NacosNamingClient({
    serverList: ['127.0.0.1:8848'],
    namespace: 'public', // 默认命名空间
    logger: console
})

await client.ready()

const aaaServiceName = 'aaaService'

// registerInstance 注册 aaa 服务的两个实例。
const instance1 =  {
    ip: '127.0.0.1',
    port: 8080
}

client.registerInstance(aaaServiceName, instance1)

const instance2 =  {
    ip: '127.0.0.1',
    port: 8081
}

client.registerInstance(aaaServiceName, instance2)
