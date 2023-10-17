import { FindOptions } from "sequelize";

export interface ICourse {
  id: number;
  span: number;
  slug: string;
  title: string;
  image?: string;
  duration?: string;
  description: string;
}

export interface IUpdateCourse {
  title: string;
  image: string;
  span: number;
  duration: string;
  description: string;
}

export interface IGetCourses {
  options?: FindOptions<ICourse>;
}

export interface ICourseInformation {
  hours?: string;
  weekDays?: string;
  date?: string;
  shift?: string;
  cohort?: string;
  alliance?: string;
  price?: string;
  currency?: string;
}
