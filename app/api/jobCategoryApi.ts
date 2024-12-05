import { IJobCategory } from "@/types/jobCategory";

const BASE_URL: string = "http://localhost:5079/api";

const jobCategoryAPI = {
  getAll: async (): Promise<IJobCategory[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobcategories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("İş kategorileri alınamadı.");
    }

    return response.json();
  },
  getById: async (id: string): Promise<IJobCategory> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobcategories/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("İş kategorisi bulunamadı.");
    }

    return response.json();
  },
  create: async (jobCategoryData: IJobCategory): Promise<IJobCategory> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobcategories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobCategoryData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    return response.json();
  },
  update: async (id: string, jobCategoryData: IJobCategory): Promise<IJobCategory> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobcategories/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobCategoryData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobcategories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("İş kategorisi silinemedi.");
    }
  },
};

export default jobCategoryAPI;
