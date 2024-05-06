// Check for mandatory environment variables
interface IConfig {
  PORT: string;
  NODE_ENV: string;
  AUTH_TOKEN_EXPIRATION: string;
  API_SECRET: string;
  PLATAFORMA_EDUCATIVA_CLIENT_HOST: string;
}

interface IMainDataBase {
  DB_HOST: string;
  DB_PORT: string;
  DB_NAME: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
}

export const mainDatabase: IMainDataBase = (() => {
  const DB_HOST = process.env.DB_HOST;
  const DB_PORT = process.env.DB_PORT;
  const DB_NAME = process.env.DB_NAME;
  const POSTGRES_USER = process.env.POSTGRES_USER;
  const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

  if (
    !DB_HOST ||
    !DB_PORT ||
    !DB_NAME ||
    !POSTGRES_USER ||
    !POSTGRES_PASSWORD
  ) {
    const envs = {
      DB_HOST,
      DB_PORT,
      DB_NAME,
      POSTGRES_USER,
      POSTGRES_PASSWORD
    };
    const missingVars = Object.entries(envs).filter(
      ([, value]) => value === undefined
    );
    throw new Error(
      `Missing database environment variables: "${missingVars.length &&
        missingVars.join(" ")}". Please check your .env file`
    );
  }

  return { DB_HOST, DB_PORT, DB_NAME, POSTGRES_USER, POSTGRES_PASSWORD };
})();

export const config: IConfig = (() => {
  const PORT = process.env.PORT;
  const NODE_ENV = process.env.NODE_ENV;
  const API_SECRET = process.env.API_SECRET;
  const AUTH_TOKEN_EXPIRATION = process.env.AUTH_TOKEN_EXPIRATION;
  const PLATAFORMA_EDUCATIVA_CLIENT_HOST = "http://localhost:3001/";
  //process.env.PLATAFORMA_EDUCATIVA_CLIENT_HOST;

  if (
    !PORT ||
    !NODE_ENV ||
    !AUTH_TOKEN_EXPIRATION ||
    !API_SECRET ||
    !PLATAFORMA_EDUCATIVA_CLIENT_HOST
  ) {
    const envs = {
      PORT,
      NODE_ENV,
      AUTH_TOKEN_EXPIRATION,
      API_SECRET,
      PLATAFORMA_EDUCATIVA_CLIENT_HOST
    };
    const missingVars = Object.entries(envs).filter(
      ([, value]) => value === undefined
    );
    throw new Error(
      `Missing config environment variables: "${missingVars.length &&
        missingVars.join(" ")}". Please check your .env file`
    );
  }

  return {
    PORT,
    NODE_ENV,
    AUTH_TOKEN_EXPIRATION,
    API_SECRET,
    PLATAFORMA_EDUCATIVA_CLIENT_HOST
  };
})();

export const localhosts = ["http://localhost:3001"];
