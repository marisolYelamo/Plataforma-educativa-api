import { Sequelize } from "sequelize";
import { mainDatabase } from "../config";

const {
  DB_NAME
  //POSTGRES_USER,
  //POSTGRES_PASSWORD,
  //DB_PORT,
  //DB_HOST
} = mainDatabase;

const db = new Sequelize(DB_NAME, "marisolyelamo", "postgres", {
  host: "database",
  port: 5432,
  dialect: "postgres",
  logging: false
});

export default db;
