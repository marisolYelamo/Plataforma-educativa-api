import { IUser } from "../../interfaces/user.interfaces";

interface IGetPagingData {
  data: {
    rows: IUser[];
    count: number;
  };
  limit?: number;
  page?: number | any;
}

export const getPagination = (
  page: number | any,
  size: number | any,
  ignorePagination?: boolean
) => {
  if (ignorePagination) return { limit: undefined, offset: undefined };
  const limit = size ? +size : 30;
  const offset = page > 1 ? (page - 1) * limit : 0;

  return { limit, offset };
};

export const getPagingData = ({ data, limit, page }: IGetPagingData) => {
  const { count: totalItems, rows: users } = data;
  if (!limit) return { totalItems, users };

  const currentPage = +page || 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { currentPage, totalPages, totalItems, users };
};
