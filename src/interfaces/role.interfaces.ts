export interface RoleInterface {
  readonly id: number;
  name: string;
  color: string;
  accessLevel: number;
}

export type RoleKeys = keyof RoleInterface;
