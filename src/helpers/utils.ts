import { v4 } from "uuid";
import { promises } from "fs";
import { RoleInterface } from "../interfaces/role.interfaces";
import { config } from "../config/index";

export const getIdToModels = (models: Array<{ id: number }>) =>
  models.map((model) => {
    return model.id;
  });

export const filterOnlyValidFields = (
  fields: Array<{ isAllowed: boolean; accessLevels: string[]; id: number }>
) => fields.filter(({ isAllowed }) => isAllowed);

export const getTopAccessLevel = (roles: RoleInterface[]): number => {
  const orderRoles = roles.sort((a, b) => a.accessLevel - b.accessLevel);
  if (orderRoles[0]) {
    return orderRoles[0].accessLevel;
  } else {
    return 4;
  }
};

export const createFile = async (fileName: string, data: string) => {
  await promises.writeFile(fileName, data);
};

export const readFile = async (fileName: string) => {
  const data = await (await promises.readFile(fileName)).toString();
  return JSON.parse(data);
};

export const deleteFile = async (fileName: string) => {
  await promises.unlink(fileName);
};

export const sanitizeSlug = (title: string) => {
  return title
    .replace(/[^\w. -]/gi, "*")
    .replace(/ /g, "-")
    .toLowerCase();
};

export const codeGenerator = () => v4().split("-")[0];

export const formatDate = (date: Date) =>
  `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }/${date.getFullYear()}`;

export const formatDateHsAndMinutes = (date: Date) => {
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${formatDate(date)} ${hours}:${minutes}`;
};

export const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export const retryForm =
  config.NODE_ENV === "dev" || config.NODE_ENV === "local"
    ? {
        link: "https://forms.gle/NmpDKH8Upm9SWCsC8",
        id: "16sW-Vnc3Ge_f8Ir83eM7FrVxMkCR0_sMxz9nMHgksB0"
      }
    : {
        link: "https://forms.gle/29cB2AmJppGnrWneA",
        id: "1y1-NqcCPNV-REdza2DdNRxQgntXx2hZIkg5d6_vZKHQ"
      };

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
