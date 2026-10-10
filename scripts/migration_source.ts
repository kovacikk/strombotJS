// Basic Datasource to cli commands

import "reflect-metadata"
import { DataSource } from "typeorm"

import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
    type: "mysql",
    host: "localhost",
    port: Number(process.env.MYSQL_PORT) ?? 3306,
    username: process.env.MYSQL_USER ?? '',
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE ?? '',
    synchronize: false,
    entities: [
        `${__dirname}/../src/data/entities/*.ts`,
        `${__dirname}/../src/data/entities/*.js`
    ],
    migrations: [
        `${__dirname}/../src/data/migrations/*.ts`,
        `${__dirname}/../src/data/migrations/*.js`
    ],
})
