import { Api400Error } from "../controllers/utils/errorHandlers/httpErrors";

export const checkMissingParameters = (
  body: { [key: string]: any },
  requiredParameters?: string[]
) => {
  if (!Object.keys(body).length)
    throw new Api400Error("Please, send any field.");

  const missingParameters: string[] = [];

  requiredParameters?.forEach((prop: string) => {
    if (body[prop] === undefined) missingParameters.push(prop);
  });

  if (missingParameters.length)
    throw new Api400Error(
      `Missing parameters. Required: ${missingParameters.join(", ")}.`
    );
};

export const checkNotAllowedParameters = (
  body: { [key: string]: any },
  allowedParameters: string[]
) => {
  const notAllowedParameters = [];

  for (const prop in body)
    if (!allowedParameters.includes(prop)) notAllowedParameters.push(prop);

  if (notAllowedParameters.length)
    throw new Api400Error(
      `Unexpected parameters. Not allowed: ${notAllowedParameters.join(", ")}.`
    );
};

export const checkTypeOf = (
  body: { [key: string]: any },
  fieldName: string,
  type: "number" | "string" | "boolean" | "array" | "object"
) => {
  const field = body[fieldName];

  switch (type) {
    case "array":
      if (!Array.isArray(field))
        throw new Api400Error(
          `The "${fieldName}" field in the req.body must be an array.`
        );
      break;
    case "object":
      if (!(field instanceof Object))
        throw new Api400Error(
          `The "${fieldName}" field in the req.body must be an object.`
        );
      break;
    default:
      if (typeof field !== type)
        throw new Api400Error(
          `The "${fieldName}" field in the req.body must be of type ${type}.`
        );
  }
};
