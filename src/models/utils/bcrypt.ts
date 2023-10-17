import crypto from "crypto";

export const genSalt = (): string => {
  return crypto.randomBytes(64).toString("hex");
};
