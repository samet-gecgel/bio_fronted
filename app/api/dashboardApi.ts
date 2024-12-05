import { IApplicationStatistics, ICompanyStatistics, IDashboardCompany, IJobPostStatistics, IPlatformStatistics, IUserStatistics } from "@/types/dashboard";

const BASE_URL: string = "http://localhost:5079/api";

const dashBoardAPI = {
    getUserStatistics: async (): Promise<IUserStatistics> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/dashboard/user-statistics`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Kullanıcı istatistikleri alınamadı.");
        }
    
        return response.json();
      },
    getJobpostStatistics: async (): Promise<IJobPostStatistics> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/dashboard/jobpost-statistics`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("iş İlanı istatistikleri alınamadı.");
        }
    
        return response.json();
      },
    getPlatformStatistics: async (): Promise<IPlatformStatistics> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/dashboard/platform-statistics`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Platform istatistikleri alınamadı.");
        }
    
        return response.json();
      },
    getApplicationStatistics: async (): Promise<IApplicationStatistics> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/dashboard/application-statistics`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("İş Başvuru istatistikleri alınamadı.");
        }
    
        return response.json();
      },
    getCompanyStatistics: async (): Promise<ICompanyStatistics> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/dashboard/company-statistics`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Firma istatistikleri alınamadı.");
        }
    
        return response.json();
      },
      getJobApplicationsLast7Days: async (): Promise<Array<{ name: string; total: number }>> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/dashboard/job-applications-last-7-days`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Son 7 günlük iş ilanı başvuru istatistikleri alınamadı.");
        }
    
        return response.json();
      },
      getCompanyDashboardStatistics: async (): Promise<IDashboardCompany> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/dashboardcompanies`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Firma istatistikleri alınamadı.");
        }
    
        return response.json();
      },
}

export default dashBoardAPI;