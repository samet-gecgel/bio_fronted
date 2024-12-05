import { IJobPost } from "./jobpost";
import { IUser } from "./user";
import { IResume } from "./resume";
import { ApplicationStatus } from "./enums/applicationStatus";

export interface IJobApplication {
  id: string;
  jobPostId: string; 
  jobPost: IJobPost; 
  applicantName: string;
  userId: string; 
  user: IUser;
  resumeId?: string; 
  resume?: IResume;
  coverLetter: string;
  applicationDate: string; 
  updatedAt?: string; 
  companyName: string;
  jobPostTitle: string;
  status: ApplicationStatus;
}
