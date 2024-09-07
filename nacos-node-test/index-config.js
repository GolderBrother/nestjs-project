import nacos from "nacos";
const client = new nacos.NacosConfigClient({
  serverAddr: "localhost:8848",
});

// 新增配置
async function addConfig() {
  try {
    // 新增
    const config = await client.publishSingle(
      "config",
      "DEFAULT_GROUP",
      '{"host":"127.0.0.1","port":8848, name: "test}'
    );

    return config;
  } catch (err) {
    console.error("Failed to get config:", err);
  }
}

// 获取配置
async function getConfig() {
  try {
    const config = await client.getConfig("config", "DEFAULT_GROUP");
    console.log("Retrieved config:", config);
    return config;
  } catch (err) {
    console.error("Failed to get config:", err);
  }
}

// 删除配置
async function removeConfig() {
  try {
    await client.remove("config", "DEFAULT_GROUP");
    console.log("Config removed successfully.");
  } catch (err) {
    console.error("Failed to remove config:", err);
  }
}
// 监听配置变化
function listenConfig() {
  client.subscribe({ dataId: "config", group: "DEFAULT_GROUP" }, (content) => {
    console.log(content);
  });
}

// 先 publishSingle 增加配置、然后 3s 后再 publishSingle 修改下这个配置。
// 可以看到 subscribe 监听到了配置变化，打印了最新配置。

addConfig();
listenConfig();
setTimeout(() => {
  client.publishSingle(
    "config",
    "DEFAULT_GROUP",
    '{"host":"127.0.0.1","port":5000}'
  );
}, 3000);

// await removeConfig();
// const config = await getConfig();
// console.log("config", config);
