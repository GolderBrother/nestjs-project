const { Etcd3 } = require('etcd3');
const ConfigManage = require('./configManage');
const RegisterManage = require('./registerManage');
const client = new Etcd3({
    hosts: 'http://localhost:2379',
    auth: {
        username: 'root',
        password: 'james'
    }
});

// (async () => { 
//     const services = await client.get('/services/a').string();
//     console.log('service A:', services);
  
//     const allServices = await client.getAll().prefix('/services').keys();
//     console.log('all services:', allServices);
   
//     const watcher = await client.watch().key('/services/a').create();
//     watcher.on('put', (req) => {
//       console.log('put', req.value.toString())
//     })
//     watcher.on('delete', (req) => {
//       console.log('delete')
//     })
//   })();

// (async function main() {
//     // 可以在这里存各种数据库连接信息、环境变量等各种配置。
//     const configManage = new ConfigManage(client);
//     await configManage.setConfig('name', 'james');
//     const configValue = await configManage.getConfig('name');
//     console.log('configValue', configValue);
// })();

(async function main() {
    const serviceName = 'my_service';
    // 可以在这里存各种数据库连接信息、环境变量等各种配置。
    const registerManage = new RegisterManage(client);
    
    // 服务注册
    await registerManage.registerService(serviceName, 'instance_1', { host: 'localhost', port:3000 });
    await registerManage.registerService(serviceName, 'instance_2', { host: 'localhost', port:3002 });

    // 服务发现
    const instances = await registerManage.discoverService(serviceName);
    console.log('所有服务节点:', instances);

    registerManage.watchService(serviceName, updatedInstances => {
        console.log('服务节点有变动:', updatedInstances);
    });
})();