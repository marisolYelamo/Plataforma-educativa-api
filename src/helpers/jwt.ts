import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import ServiceError from "../services/utils/serviceErrors";

interface IData {
  email: string;
  lastName: string;
  firstName: string;
  id: number | string;
  salt: string;
}

export const createJWT = (data: IData): string => {
  const token: string = jwt.sign(
    {
      user: {
        id: data.id,
        email: data.email,
        lastName: data.lastName,
        firstName: data.firstName
      },
      expiresIn: config.AUTH_TOKEN_EXPIRATION
    },
    config.API_SECRET
  );

  return token;
};

export const decodeJWT = (token: string): any => {
  return jwt.decode(token);
};

export const createAPIToken = (user: { id: number; email: string }): string => {
  const token: string = jwt.sign(
    {
      user,
      expiresIn: config.AUTH_TOKEN_EXPIRATION
    },
    config.API_SECRET
  );

  return token;
};

export const validateAPIToken = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, config.API_SECRET);
  } catch (err) {
    throw new ServiceError("invalid_token", "Token inválido");
  }
};
