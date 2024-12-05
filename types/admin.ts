import { UserRole } from "./enums/userRole";

export interface IAdmin {
    id: string,
    fullName : string,
    email : string,
    department : string,
    password : string,
    createdAt: string; 
    updatedAt?: string;
    role: UserRole; 
}