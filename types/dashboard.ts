import { IJobPost } from "./jobpost";

export interface IUserStatistics {
  totalUsers: number;
  approvedUsers: number;
  newUsersLast30Days: number;
}

export interface IJobPostStatistics {
  activeJobPosts: number;
  totalJobPosts: number;
  newJobPostsLast30Days: number;
}

export interface IApplicationStatistics {
  totalApplications: number;
  recentApplications: IRecentApplication[];
  mostAppliedCompanies: IMostAppliedCompanies[];
}

export interface IRecentApplication {
  id: string;
  jobPostTitle: string;
  companyName: string;
  applicantName: string;
  applicationDate: string;
}

export interface IMostAppliedCompanies {
  companyName: string;
  totalApplications: number;
}

export interface ICompanyStatistics {
  totalCompanies: number;
  approvedCompanies: number;
  newCompaniesLast30Days: number;
}

export interface IPlatformStatistics {
  userStatistics: IUserStatistics;
  companyStatistics: ICompanyStatistics;
  applicationStatistics: IApplicationStatistics;
  jobPostStatistics: IJobPostStatistics;
}

export interface IJobApplicationsLast7Days {
  key: string;  
  value: number; 
}

export interface IDashboardCompany {
  totalJobPosts: number;
  activeJobPosts: number;
  approvedJobPosts: number;
  pendingJobPosts: number;
  rejectedJobPosts: number;
  totalApplications: number;
  totalJobPostViews: number;
  activeJobPostsTable: IJobPost[];
  recentApplications: IRecentApplication[];
  jobApplicationsLast7Days: IJobApplicationsLast7Days[];

}
