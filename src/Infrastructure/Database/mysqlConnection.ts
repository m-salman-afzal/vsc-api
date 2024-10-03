import {DataSource} from "typeorm";

import {BOOLEAN_VALUES} from "@appUtils/Constants";

import {database} from "@infraConfig/index";

import type {DataSourceOptions} from "typeorm";

const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: database.HOST,
    port: Number(database.PORT),
    username: database.USERNAME,
    password: database.PASSWORD,
    database: database.DB,
    entities: [__dirname + "/Models/**/*{.ts,.js}"],
    migrations: [__dirname + "/Migration/*{.ts,.js}"],
    synchronize: database.SYNCHRONIZE === BOOLEAN_VALUES.TRUE,
    logging: database.LOGGING === BOOLEAN_VALUES.TRUE
};

export const dataSource = new DataSource(dataSourceOptions);
