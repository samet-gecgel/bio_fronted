import { ApplicationStatus } from "./enums/applicationStatus";
import { EmployeesRange } from "./enums/employeesRange";
import { UserRole } from "./enums/userRole";
import { IJobPost } from "./jobpost";

export interface ICompany {
    id: string;
    tcKimlik: string;
    vkn: string;
    fullName: string;
    phone: string;
    birthDate: string;
    companyName: string;
    email: string;
    position: string;
    district: string;
    password: string;
    employeesInCity: EmployeesRange;
    employeesInCountry: EmployeesRange;
    createdAt: string;
    updatedAt?: string;
    approvalStatus: ApplicationStatus; 
    role: UserRole;
    jobPosts: IJobPost[];
  }