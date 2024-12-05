import { IAdmin } from "@/types/admin";
import { IPagedResult } from "@/types/pagedResult";

const BASE_URL: string = "http://localhost:5079/api";

const adminAPI = {
  getAll: async (): Promise<IAdmin[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/admins/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Adminler alınamadı.");
    }

    return response.json();
  },
  getPaged: async (pageNumber = 1, pageSize = 10): Promise<IPagedResult<IAdmin>> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/admins/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Adminler alınamadı.");
    }

    return response.json();
  },
  getById: async (id: string): Promise<IAdmin> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/admins/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Admin bulunamadı.");
    }

    return response.json();
  },
  create: async (adminData: IAdmin): Promise<IAdmin> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/admins/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    return response.json();
  },
  update: async (id: string, adminData: IAdmin): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/admins/update/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }
  
    if (response.status === 204) {
      console.log("Güncelleme başarılı.");
    }
  },
  
  updatePassword: async (
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/admins/${id}/update-password`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      }
    );
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }
  
    if (response.status === 204) {
      console.log("Parola güncelleme başarılı.");
    }
  },
  
  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/admins/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Admin silme işlemi başarısız.");
    }
  },
  login: async (loginData: { username: string; password: string }): Promise<{ token: string }> => {
    const response = await fetch(`${BASE_URL}/admins/login`, {
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
};

export default adminAPI;
