/**
 * 配置管理中心：可以在这里存各种数据库连接信息、环境变量等各种配置。
 */
class ConfigManage {
    client;
    constructor(client) {
        this.client = client;
    }

    async getConfig(key) {
        return await this.client.get(key).string();
    }

    async setConfig(key, value) {
        return await this.client.put(key).value(value)
    }

    async deleteConfig(key) {
        return await this.client.delete().key(key);
    }
}

module.exports = ConfigManage;