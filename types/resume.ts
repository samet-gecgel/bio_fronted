import { EducationLevel } from "./enums/educationLevel";
import { IUser } from "./user";

export interface IResume {
  id: string; 
  userId: string; 
  resumeName: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
  requiredEducationLevel: EducationLevel;
  languages: string;
  hobbies: string;
  createdAt: string; 
  updatedAt?: string;
  user: IUser;
}
