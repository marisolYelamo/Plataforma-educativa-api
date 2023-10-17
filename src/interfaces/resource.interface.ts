export interface IResource {
  id: number;
  link: string;
  title: string;
  moduleId: number;
}

export interface IUpdateResource {
  link: string;
  title: string;
}
