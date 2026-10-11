import "reflect-metadata";
import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
dotenv.config();

export default new DataSource({
  type: "mysql",
  host: "db",
  port: 3306,
  username: process.env.MYSQL_USER ?? "",
  password: process.env.MYSQL_PASSWORD ?? "",
  database: process.env.MYSQL_DATABASE ?? "",
  synchronize: false,
  entities: [
    `${__dirname}/data/entities/*.ts`,
    `${__dirname}/data/entities/*.js`,
  ],
  migrations: [
    `${__dirname}/data/migrations/*.ts`,
    `${__dirname}/data/migrations/*.js`,
  ],
  migrationsRun: true,
});
