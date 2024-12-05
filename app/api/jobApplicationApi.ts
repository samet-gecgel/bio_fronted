import { IJobApplication } from "@/types/jobApplication";
import { IJobApplicationDetail } from "@/types/jobApplicationDetail";

const BASE_URL: string = "http://localhost:5079/api";

const jobApplicationAPI = {
  getByUserId: async (): Promise<IJobApplication[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobapplications/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Kullanıcı başvuruları alınamadı.");
    }

    return response.json();
  },
  getByCompanyId: async (companyId: string): Promise<IJobApplication[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobapplications/company/${companyId}/applications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Şirketin başvuruları alınamadı.");
    }
  
    return response.json();
  },
  getApplicationDetail: async (applicationId: string): Promise<IJobApplicationDetail> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobapplications/applications/${applicationId}/detail`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Başvuru detayı alınamadı.");
    }
  
    return response.json();
  },
  
  getByJobPostId: async (jobPostId: string): Promise<IJobApplication[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobapplications/jobPost/${jobPostId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("İş ilanı başvuruları alınamadı.");
    }

    return response.json();
  },
  getAll: async (): Promise<IJobApplication[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobapplications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Tüm başvurular alınamadı.");
    }

    return response.json();
  },
  getById: async (id: string): Promise<IJobApplication> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobapplications/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Başvuru bulunamadı.");
    }

    return response.json();
  },
  create: async (jobApplicationData: IJobApplication): Promise<IJobApplication> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobapplications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobApplicationData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    return response.json();
  },
  update: async (id: string, jobApplicationData: IJobApplication): Promise<IJobApplication> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobapplications/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobApplicationData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobapplications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Başvuru silinemedi.");
    }
  },
  approve: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobapplications/${id}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Başvuru onaylama işlemi başarısız.");
    }
  },
  reject: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobapplications/${id}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Başvuru reddetme işlemi başarısız.");
    }
  },
};

export default jobApplicationAPI;
