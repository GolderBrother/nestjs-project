# node 读取 end、yaml配置文件
yaml 的格式更适合有层次关系的配置，而 .env 更适合简单的配置。

同样，也可以通过 NODE_ENVIRMENT 环境变量来切换生产、开发的配置文件。

node 里的配置一般就用这两种方式