"use client";

import React, { useEffect, useState } from "react";
import { SuperAdminSidebar } from "@/components/custom/SuperAdminComponents/SuperAdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { INews } from "@/types/news";
import { useParams, useRouter } from "next/navigation";
import { newsAPI } from "@/app/api";
import Image from "next/image";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { AdminSidebar } from "@/components/custom/SuperAdminComponents/AdminSidebar";

const NewsEditPage = () => {
  const [newsData, setNewsData] = useState<INews | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const params = useParams();
  const newsId = params.id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {

      router.push("/admin/login");
      return;
    }

    const role = getRoleFromToken(token);
    if (role !== "Admin") {

      router.push("/");
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setFetching(true);
        const response = await newsAPI.getById(newsId);
        const news = response.data;
        setNewsData(news);
        setPhotoPreview(news.imagePath);
      } catch (err: any) {
        setError(err.message || "Haber bilgileri alınırken bir hata oluştu.");
      } finally {
        setFetching(false);
      }
    };

    fetchNewsData();
  }, [newsId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newsData) return;

      setLoading(true);
      const formData = new FormData();
      formData.append("title", newsData.title);
      formData.append("description", newsData.description);

      if (newImage) {
        formData.append("newsImage", newImage);
      }

      await newsAPI.update(newsId, formData);
      setDialogOpen(true);
    } catch (err: any) {
      setError(err.message || "Haber güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof INews, value: string) => {
    if (!newsData) return;
    setNewsData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  if (fetching) {
    return (
      <div className="flex flex-col md:flex-row h-screen">
        <SuperAdminSidebar />
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-6 md:p-8">
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (!newsData) {
    return <div className="text-red-500">Haber bulunamadı.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="overflow-y-hidden">
        <AdminSidebar />
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-6 md:p-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Haber Düzenle
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Haber Başlığı
                </label>
                <Input
                  type="text"
                  value={newsData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Haber başlığını girin"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Haber Özeti
                </label>
                <Textarea
                  value={newsData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Haber özetini girin"
                  className="mt-1 h-64"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Haber Fotoğrafı
                </label>
                {photoPreview && (
                  <div className="mt-4">
                    <Image
                      src={photoPreview}
                      alt="Fotoğraf önizleme"
                      width={150}
                      height={150}
                      className="rounded"
                      unoptimized
                    />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? "Güncelleniyor..." : "Güncelle"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Başarılı!</AlertDialogTitle>
            <AlertDialogDescription>
              Haber başarıyla güncellendi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => router.push("/admin/news")}>
              Tamam
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewsEditPage;
