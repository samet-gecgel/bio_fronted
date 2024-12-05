import { ApplicationStatus } from "./enums/applicationStatus";
import { EducationLevel } from "./enums/educationLevel";
import { ExperienceLevel } from "./enums/experienceLevel";
import { JobType } from "./enums/jobType";
import { WeekDay } from "./enums/weekDay";
import { IJobApplication } from "./jobApplication";

export interface IJobPost {
  id : string;
  title: string;
  description: string;
  minSalary?: number;
  maxSalary?: number;
  publishedDate: string;
  applicationDeadline: string;
  district: string;
  benefits: string;
  offDays: WeekDay;
  requiresDrivingLicense?: boolean;
  minAge?: string;
  maxAge?: string;
  minExperienceYears: number;
  requiredEducationLevel: EducationLevel;
  experienceLevel: ExperienceLevel;
  isDisabledFriendly: boolean;
  viewCount: number,
  applicationCount: number;
  categoryId?: string;
  categoryName: string;
  companyId: string;
  companyName: string;
  jobType: JobType;
  applicationStatus: ApplicationStatus;
  isActive: boolean;
  jopApplications : IJobApplication[];
}