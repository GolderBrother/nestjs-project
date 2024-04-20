/**
 * 注册中心：服务注册、服务发现功能
 */
class RegisterManage {
    client;
    constructor(client) {
        this.client = client;
    }

    /**
     * 服务注册
     * @param {*} serviceName 
     * @param {*} instanceId 
     * @param {*} metadata 
     */
    async registerService(serviceName, instanceId, metadata) {
        // 注册的时候我们按照 /services/服务名/实例id 的格式来指定 key。
        const key = `/services/${serviceName}/${instanceId}`;
        // 设置了租约 10s，这个就是过期时间的意思，然后过期会自动删除
        const lease = this.client.lease(10);
        console.log('lease', lease);
        await lease.put(key).value(JSON.stringify(metadata));
        // 我们可以监听 lost 事件，在过期后自动续租。
        lease.on('lost', async () => {
            console.log('租约过期，重新注册...');
            registerService(serviceName, instanceId, metadata);
        })
    }

    /**
     * 服务发现: 就是查询 /services/服务名 下的所有实例，返回它的信息。
     * @param {*} serviceName 
     */
    async discoverService(serviceName) {
        const instances = await this.client.getAll().prefix(`/services/${serviceName}`).strings();
        return Object.entries(instances).map(([key, value]) => JSON.parse(value));
    }

    /**
     * 监听服务变更
     * @param {*} serviceName 
     * @param {*} callback 
     */
    async watchService(serviceName, callback) {
        const watcher = await this.client.watch().prefix(`/services/${serviceName}`).create();
        watcher.on('put', async event => {
            console.log('新的服务节点添加:', event.key.toString());
            callback(await this.discoverService(serviceName));
        }).on('delete', async event => {
            console.log('服务节点删除:', event.key.toString());
            callback(await this.discoverService(serviceName));
        });
    }
}

module.exports = RegisterManage;