"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { newsAPI } from "@/app/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

const NewsAddPage: React.FC = () => {
  const [newsData, setNewsData] = useState({
    title: "",
    description: "",
    photo: null as File | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
;
      router.push("/admin/login");
      return;
    }

    const role = getRoleFromToken(token);
    if (role !== "Admin") {

      router.push("/");
    }
  }, [router]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("Title", newsData.title);
      formData.append("Description", newsData.description);
      if (newsData.photo) {
        formData.append("newsImage", newsData.photo);
      }

      await newsAPI.create(formData);

      setDialogMessage("Haber başarıyla eklendi!");
      setDialogOpen(true);

      setNewsData({
        title: "",
        description: "",
        photo: null,
      });
      setPhotoPreview(null);
    } catch (err: any) {
      setDialogMessage(err.message || "Haber eklenirken bir hata oluştu.");
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewsData({ ...newsData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    router.push("/admin/news"); 
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="overflow-y-hidden">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-6 md:p-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Haber Ekle
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                {/* Haber Başlığı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Haber Başlığı
                  </label>
                  <Input
                    type="text"
                    value={newsData.title}
                    onChange={(e) =>
                      setNewsData({ ...newsData, title: e.target.value })
                    }
                    placeholder="Haber başlığını girin"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Haber Açıklaması */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Haber Açıklaması
                  </label>
                  <Textarea
                    value={newsData.description}
                    onChange={(e) =>
                      setNewsData({ ...newsData, description: e.target.value })
                    }
                    placeholder="Haber açıklamasını girin"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Haber Fotoğrafı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Haber Fotoğrafı
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="mt-1"
                  />
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
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Ekleniyor..." : "Haberi Ekle"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bilgilendirme</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleDialogClose}>Tamam</Button>{" "}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewsAddPage;
