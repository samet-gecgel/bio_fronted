import { IUser } from "@/types/user";
import { IPagedResult } from "@/types/pagedResult";

const BASE_URL: string = "http://localhost:5079/api";

const userAPI = {
  create: async (userData: IUser): Promise<IUser> => {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kayıt başarısız: ${errorText}`);
    }

    return response.json();
  },
  login: async (loginData: { email: string; password: string }): Promise<{ token: string }> => {
    const response = await fetch(`${BASE_URL}/users/login`, {
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
  getAll: async (): Promise<IUser[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Kullanıcılar alınamadı.");
    }

    return response.json();
  },
  getPaged: async (pageNumber = 1, pageSize = 10): Promise<IPagedResult<IUser>> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/users/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Sayfalı kullanıcılar alınamadı.");
    }

    return response.json();
  },
  getById: async (id: string): Promise<IUser> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Kullanıcı bulunamadı.");
    }

    return response.json();
  },
  getByApprovalStatus: async (status: string): Promise<IUser[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/users/approval-status/${status}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Onay durumuna göre kullanıcılar alınamadı.");
    }

    return response.json();
  },
  approve: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/users/${id}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Kullanıcı onaylama işlemi başarısız.");
    }
  },
  reject: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/users/${id}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Kullanıcı reddetme işlemi başarısız.");
    }
  },
  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Kullanıcı silme işlemi başarısız.");
    }
  },
  update: async (id: string, userData: IUser): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }
    if (response.status === 204) {
      console.log("Kulalanıcı bilgileri güncelleme başarılı.");
    }
  },
  updatePassword: async (
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/users/${id}/update-password`,
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
};

export default userAPI;
