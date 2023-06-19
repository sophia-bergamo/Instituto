import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "sophia",
    password: "123456",
    database: "test",
    synchronize: false,
    logging: true,
    entities: [User],
    migrations: [],
    subscribers: [],
})
