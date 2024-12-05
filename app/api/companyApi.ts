import { ICompany } from "@/types/company";
import { IPagedResult } from "@/types/pagedResult";

const BASE_URL: string = "http://localhost:5079/api";

const companyAPI = {
  getAll: async (): Promise<ICompany[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/companies`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Şirketler alınamadı.");
    }

    return response.json();
  },
  getPaged: async (pageNumber = 1, pageSize = 10): Promise<IPagedResult<ICompany>> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/companies/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Sayfalı şirketler alınamadı.");
    }

    return response.json();
  },
  create: async (companyData: ICompany): Promise<ICompany> => {
    const response = await fetch(`${BASE_URL}/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    return response.json();
  },
  getByApprovalStatus: async (status: string): Promise<ICompany[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/companies/approval-status/${status}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Şirketler alınamadı.");
    }

    return response.json();
  },
  login: async (loginData: { email: string; password: string }): Promise<{ token: string }> => {
    const response = await fetch(`${BASE_URL}/companies/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Giriş başarısız: ${errorText}`);
    }

    return response.json();
  },
  getById: async (id: string): Promise<ICompany> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/companies/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Şirket alınamadı.");
    }

    return response.json();
  },
  update: async (id: string, companyData: ICompany): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/companies/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    
  },
  approve: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/companies/${id}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Şirket onaylama işlemi başarısız.");
    }
  },
  reject: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/companies/${id}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Şirket reddetme işlemi başarısız.");
    }
  },
  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/companies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Şirket silme işlemi başarısız.");
    }
  },
  updatePassword: async (id: string, passwordData: { currentPassword: string; newPassword: string }): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/companies/${id}/update-password`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Şifre güncellenemedi: ${errorText}`);
    }
  },
};

export default companyAPI;
