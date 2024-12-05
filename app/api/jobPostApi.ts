import { IJobPost } from "@/types/jobpost";
import { IJobPostFilter } from "@/types/jobPostFilter";
import { IPagedResult } from "@/types/pagedResult";

const BASE_URL: string = "http://localhost:5079/api";

const jobPostAPI = {
  getAll: async (): Promise<IJobPost[]> => {
    const response = await fetch(`${BASE_URL}/jobposts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("İş ilanları alınamadı.");
    }

    return response.json();
  },
  getPaged: async (pageNumber = 1, pageSize = 10): Promise<IPagedResult<IJobPost>> => {
    try {
      const response = await fetch(`${BASE_URL}/jobposts/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Hatası: ${errorText}`);
      }
  
      const data = await response.json();
      return {
        data: data.data || [],
        totalItems: data.totalItems || 0,
        totalPages: data.totalPages || 0,
        errorMessage: data.errorMessage || null,
      };
    } catch (error) {
      console.error("Sayfalı iş ilanları alınırken bir hata oluştu:", error);
      throw new Error("Sayfalı iş ilanları alınırken bir hata oluştu.");
    }
  },

  getByCompanyIdPaged: async (pageNumber = 1, pageSize = 8): Promise<IPagedResult<IJobPost>> => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/jobposts/company/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Hatası: ${errorText}`);
      }
  
      const data = await response.json();
      return {
        data: data.data || [],
        totalItems: data.totalItems || 0,
        totalPages: data.totalPages || 0,
        errorMessage: data.errorMessage || null,
      };
    } catch (error) {
      console.error("Sayfalı iş ilanları alınırken bir hata oluştu:", error);
      throw new Error("Sayfalı iş ilanları alınırken bir hata oluştu.");
    }
  },
  
  getActive: async (): Promise<IJobPost[]> => {
    const response = await fetch(`${BASE_URL}/jobposts/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Aktif iş ilanları alınamadı.");
    }

    return response.json();
  },
  getById: async (id: string): Promise<IJobPost> => {
    const response = await fetch(`${BASE_URL}/jobposts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("İş ilanı bulunamadı.");
    }

    return response.json();
  },
  getByCategoryId: async (categoryId: string): Promise<IJobPost[]> => {
    const response = await fetch(`${BASE_URL}/jobposts/category/${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Kategoriye göre iş ilanları alınamadı.");
    }

    return response.json();
  },
  getByCompanyId: async (): Promise<IJobPost[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobposts/company`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Şirkete göre iş ilanları alınamadı.");
    }

    return response.json();
  },
  filter: async (filterData: IJobPostFilter): Promise<IJobPost[]> => {
    try {
      const cleanedFilterData: Record<string, string | number | boolean> = {};
  
      Object.keys(filterData).forEach((key) => {
        const value = filterData[key as keyof IJobPostFilter];
        if (value !== null && value !== undefined) {
          if (typeof value === "object" || typeof value === "number") {
            cleanedFilterData[key] = value.toString();
          } else {
            cleanedFilterData[key] = value;
          }
        }
      });
  
      const queryParams = new URLSearchParams(cleanedFilterData).toString();
  
      const response = await fetch(`${BASE_URL}/jobposts/GetPagedJobPosts?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Filtreleme işlemi başarısız: ${errorText}`);
      }
  
      return response.json();
    } catch (error) {
      console.error("İş ilanı filtreleme sırasında bir hata oluştu:", error);
      throw new Error("İş ilanı filtreleme işlemi sırasında bir hata oluştu.");
    }
  },
  getLatest: async (count: number = 4): Promise<IJobPost[]> => {
    const response = await fetch(`${BASE_URL}/jobposts/latest?count=${count}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Son iş ilanları alınamadı.");
    }
  
    return response.json();
  },  
  create: async (jobPostData: IJobPost): Promise<IJobPost> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobposts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobPostData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    return response.json();
  },
  update: async (id: string, jobPostData: IJobPost): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobposts/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobPostData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hata: ${errorText}`);
    }

    if (response.status === 204) {
      console.log("Güncelleme başarılı.");
    }
  },
  approve: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobposts/${id}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("İş İlanı onaylama işlemi başarısız.");
    }
  },
  reject: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobposts/${id}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("İş İlanı reddetme işlemi başarısız.");
    }
  },
  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/jobposts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("İş ilanı silme işlemi başarısız.");
    }
  },
};

export default jobPostAPI;
