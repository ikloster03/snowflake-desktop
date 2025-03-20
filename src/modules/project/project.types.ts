import { ValueOf } from "@/core";
import { ProjectID } from "@/core/id";
import { PROJECT_TYPE } from "./project.const";
export type ProjectType = ValueOf<typeof PROJECT_TYPE>;

export interface IProject {
  id: ProjectID;
  name: string;
  description: string;
  path: string; // путь к папке проекта
  created: Date;
  updated: Date;
  isOpen: boolean;
  type: ProjectType;
}
