import { Request } from "express";

export interface IUser {
  readonly id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  active?: boolean;
  knowledge?: string | null;
  discordId?: string | null;
  discordTag?: string | null;
  salt?: string;
  activeToken?: string;
  resetToken?: string;
}

export interface IGetUserAuthInfoRequest extends Request {
  role?: string;
  userData?: {
    id?: number;
    biggestAccessLevel: number | null;
    isUser?: boolean;
  };
}

export interface IUserResponse {
  userId: number;
  message: string;
}

export type AllowUserKeysToUpdate = "id" | "email" | "discordId" | "discordTag";
