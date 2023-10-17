import acl from "express-acl";

const configObject = {
  filename: "nacl.yaml",
  path: "src",
  defaultRole: "user",
  roleSearchPath: "role",
};

const responseObject = {
  code: 403,
  message: "You are not authorized to access this resource",
};

acl.config(configObject, responseObject);

export default acl;
