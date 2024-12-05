import { ICertificate } from "./certificate";
import { ApplicationStatus } from "./enums/applicationStatus";
import { UserRole } from "./enums/userRole";
import { IJobApplication } from "./jobApplication";
import { IResume } from "./resume";

export interface IUser {
    id: string; 
    fullName: string;
    tcKimlik: string;
    email: string;
    phone: string;
    birthDate: string; 
    district: string;
    password: string;
    role: UserRole; 
    approvalStatus: ApplicationStatus; 
    createdAt: string; 
    updatedAt?: string;
    resumes: IResume[]; 
    certificates: ICertificate[];
    jobApplications: IJobApplication[]; 
  }


