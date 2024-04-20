import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "migration-test",
    synchronize: false,
    logging: true,
    entities: [User],
    // migrations: [],
    // 生产环境，我们不会用 synchronize 自动同步，就是用的 migration 的方式来建表。
    migrations: ['./src/migration/**.ts'],
    subscribers: [],
    poolSize: 10,
    connectorPackage: 'mysql2',
    extra: {
        authPlugin: 'sha256_password',
    }
})

