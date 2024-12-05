import { ICertificate } from "@/types/certificate";

const BASE_URL: string = "http://localhost:5079/api";

const certificateAPI = {
  create: async (certificateData: FormData): Promise<ICertificate> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/certificates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: certificateData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    return response.json();
  },
  update: async (id: string, certificateData: FormData): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/certificates/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: certificateData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    if (response.status === 204) {
      console.log("Güncelleme başarılı.");
    }
  },
  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/certificates/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Sertifika silme işlemi başarısız.");
    }
  },
  getById: async (id: string): Promise<ICertificate> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/certificates/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Sertifika alınamadı.");
    }

    return response.json();
  },
  getUserCertificates: async (): Promise<ICertificate[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/certificates/user-certificates`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Kullanıcı sertifikaları alınamadı.");
    }

    return response.json();
  },
};

export default certificateAPI;
