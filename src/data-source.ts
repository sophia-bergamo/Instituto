import "reflect-metadata"
import { DataSource } from "typeorm"
import { User2 } from "./user2"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "sophia",
    password: "123456",
    database: "test",
    synchronize: false,
    logging: true,
    entities: [User2],
    migrations: [],
    subscribers: [],
})
