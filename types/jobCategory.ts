import { IJobPost } from "./jobpost";

export interface IJobCategory{
    id: string;
    name: string;
    jobPost: IJobPost[];
}