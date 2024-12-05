import { EducationLevel } from "./enums/educationLevel";
import { ExperienceLevel } from "./enums/experienceLevel";
import { JobType } from "./enums/jobType";
import { WeekDay } from "./enums/weekDay";

export interface IJobPostFilter {
  title?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  districts?: string[];
  offDays?: WeekDay;
  requiredEducationLevel?: EducationLevel;
  jobTypes?: JobType;
  experienceLevel?: ExperienceLevel;
  requiresDrivingLicense?: boolean;
  isDisabledFriendly?: boolean;
}
