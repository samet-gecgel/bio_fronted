import { INews } from "@/types/news";


const BASE_URL : string = "http://localhost:5079/api";

const newsAPI = {
    getAll: async (): Promise<INews[]> => {
      const response = await fetch(`${BASE_URL}/news`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Haberler alınamadı.");
      }
  
      return response.json();
    },
    getById: async (id: string): Promise<INews> => {
      const response = await fetch(`${BASE_URL}/news/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Haber bulunamadı.");
      }
  
      return response.json();
    },
    create: async (data: FormData): Promise<INews> => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/news`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hata: ${errorText}`);
      }
  
      return response.json();
    },
    update: async (id: string, data: FormData): Promise<void> => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/news/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
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
      const response = await fetch(`${BASE_URL}/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Haber silme işlemi başarısız.");
      }
    },
    getPaged: async (pageNumber = 1, pageSize = 10): Promise<{ data: INews[]; totalPages: number }> => {
      const response = await fetch(
        `${BASE_URL}/news/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
      if (!response.ok) {
        throw new Error("Haberler alınamadı.");
      }
    
      const responseData = await response.json();
      return {
        data: responseData.data || [],
        totalPages: Math.ceil((responseData.totalItems || 0) / pageSize),
      };
    }
    
  };
  
  export default newsAPI;