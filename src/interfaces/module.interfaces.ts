export interface IModule {
  id: number;
  span?: number;
  slug?: string;
  title: string;
  courseId: number;
  visibility: boolean;
  description?: string;
  type?: "class" | "workshop" | "assignment";
  UserModule?: any;
}

export interface IUpdateModule {
  title?: string;
  slug?: string;
  courseId?: number;
  description?: string;
  visibility?: boolean;
  type?: "class" | "workshop" | "assignment";
}
