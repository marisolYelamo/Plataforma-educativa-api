import { Sequelize } from "sequelize";
import { mainDatabase } from "../config";

const {
  DB_NAME,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  DB_PORT,
  DB_HOST
} = mainDatabase;
const port = Number(DB_PORT);
const db = new Sequelize(DB_NAME, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: DB_HOST,
  port,
  dialect: "postgres",
  logging: false
});

export default db;
