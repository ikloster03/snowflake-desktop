import { ProjectID } from "@/core/id";

export interface IProject {
  id: ProjectID;
  name: string;
  description: string;
  path: string; // путь к папке проекта
  created: Date;
  updated: Date;
  isOpen: boolean;
}
