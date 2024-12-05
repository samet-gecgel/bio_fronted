import { IUser } from "./user";

export interface ICertificate {
    id: string; 
    userId: string; 
    certificateName: string;
    institution: string;
    issueDate: string; 
    filePath: string;
    user: IUser;
  }
  