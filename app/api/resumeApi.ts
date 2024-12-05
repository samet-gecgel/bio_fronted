import { IResume } from "@/types/resume";

const BASE_URL: string = "http://localhost:5079/api";

const resumeAPI = {
  getAll: async (): Promise<IResume[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/resumes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Tüm özgeçmişler alınamadı.");
    }

    return response.json();
  },
getByUserId: async (userId: string): Promise<IResume[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/resumes/user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Kullanıcı özgeçmişleri alınamadı.");
  }

  return response.json();
},

  getById: async (id: string): Promise<IResume> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/resumes/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Özgeçmiş bulunamadı.");
    }

    return response.json();
  },
  getByJobApplicationId: async (jobApplicationId: string): Promise<IResume> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/resumes/jobApplication/${jobApplicationId}/resume`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("İş başvurusuna ait özgeçmiş alınamadı.");
    }

    return response.json();
  },
  create: async (resumeData: IResume): Promise<IResume> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/resumes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    return response.json();
  },
  update: async (id: string, resumeData: IResume): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/resumes/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

  },
  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/resumes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Özgeçmiş silinemedi.");
    }
  },
};

export default resumeAPI;
