export interface IGetAllUsers {
  offset?: number;
  limit?: number;
  roleId?: number;
  search?: string | any;
  discordId?: string;
  active?: string;
  exact?: boolean;
}
