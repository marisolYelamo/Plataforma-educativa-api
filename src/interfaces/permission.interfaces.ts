export interface IPermissions {
  id?: number;
  title: string;
  type: "read" | "create" | "delete" | "edit";
}

export interface IPermissionsLevels {
  isAllowed: boolean;
  accessLevels: string[];
}
