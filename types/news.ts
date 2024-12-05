export interface INews {
    id: string;
    title: string;
    description: string;
    imagePath: string;
    adminId: string;
    adminName: string;
    createdAt: string; 
    updatedAt?: string;
  }