import { ICertificate } from "./certificate";
import { ApplicationStatus } from "./enums/applicationStatus";

export interface IJobApplicationDetail{
    id: string;
    jobTitle: string;
    applicantName: string;
    applicationDate: string;
    status: ApplicationStatus
    coverLetter: string;
    resumeId: string;
    Certificates: ICertificate[];
}