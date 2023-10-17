interface IErrors {
  userId: number;
  message: string;
}

interface IResponse {
  data?: any;
  message?: string;
  errors?: IErrors[];
}

export const ok = ({ data, message, errors }: IResponse) => ({
  data,
  status: 200,
  message: message || "success.",
  errors
});

export const created = ({ data, message, errors }: IResponse) => ({
  data,
  status: 201,
  message: message || "created successfully.",
  errors
});

export const noContent = () => ({
  status: 204,
  message: "deleted successfully."
});

export const unauthorized = ({ data, message }: IResponse) => ({
  data,
  status: 401,
  message: message || "unauthorized."
});

export const badRequest = ({ message, errors }: IResponse) => ({
  status: 400,
  message: message || "Bad Request.",
  errors
});

export const forbidden = ({ data, message }: IResponse) => ({
  data,
  status: 403,
  message: message || "forbidden."
});

export const notFound = ({ message, errors }: IResponse) => ({
  status: 404,
  message: message || "not found.",
  errors
});

export const error = ({ data, message }: IResponse) => ({
  data,
  status: 500,
  message: message || "Error on the Server."
});
