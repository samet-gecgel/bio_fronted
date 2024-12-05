"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";
import { certificateAPI } from "@/app/api";
import { MainNav } from "@/components/ui/navigation-menu";
import DatePicker from "@/components/custom/DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import { ICertificate } from "@/types/certificate";
import { Skeleton } from "@/components/ui/skeleton";

const UserCertificateEditPage = () => {
  const [certificateData, setCertificateData] = useState<ICertificate | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  const params = useParams();
  const certificateId = params.id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/user/login");
      return;
    }

    const role = getRoleFromToken(token);
    if (role !== "JobSeeker") {
      router.push("/");
    }

    const fetchCertificate = async () => {
      try {
        const response = await certificateAPI.getById(certificateId);
        const certificates = response.data;
        setCertificateData(certificates);
      } catch (err: any) {
        setError(
          err.message || "Sertifika bilgileri alınırken bir hata oluştu."
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchCertificate();
  }, [router, certificateId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!certificateData) return;
      setLoading(true);

      const formData = new FormData();
      formData.append("certificateName", certificateData.certificateName);
      formData.append("institution", certificateData.institution);
      formData.append("issueDate", certificateData.issueDate);

      if (certificateData.filePath) {
        formData.append("filePath", certificateData.filePath);
      }

      await certificateAPI.update(certificateId, formData);

      setDialogMessage("Sertifika başarıyla güncellendi.");
      setDialogOpen(true);
    } catch (err: any) {
      setError(err.message || "Sertifika bilgileri güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filePath = e.target.files?.[0];
    if (filePath) {
      setCertificateData({ ...certificateData, filePath: filePath });
    }
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setCertificateData((prev) =>
      prev ? { ...prev, issueDate: formattedDate } : null
    );
  };

  const handleInputChange = (field: keyof ICertificate, value: string) => {
    if (!certificateData) return;
    setCertificateData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  if (isFetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Sertifika Düzenle
        </h2>

        {error && (
          <div className="text-red-600 text-center mb-4">{error}</div>
        )}

        <Card className="p-6 max-w-lg mx-auto shadow-md">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Sertifika Adı */}
            <div>
              <Label htmlFor="certificateName">Sertifika Adı</Label>
              <Input
                id="certificateName"
                name="certificateName"
                type="text"
                placeholder="Sertifika Adını Girin"
                value={certificateData?.certificateName || ""}
                onChange={(e) =>
                  handleInputChange("certificateName", e.target.value)
                }
                className="mt-2"
                required
              />
            </div>

            {/* Kurum */}
            <div>
              <Label htmlFor="institution">Kurum</Label>
              <Input
                id="institution"
                name="institution"
                type="text"
                placeholder="Kurum Adını Girin"
                value={certificateData?.institution || ""}
                onChange={(e) =>
                  handleInputChange("institution", e.target.value)
                }
                className="mt-2"
                required
              />
            </div>

            {/* Veriliş Tarihi */}
            <div className="col-span-2 md:col-span-1">
              <Label htmlFor="issueDate">Veriliş Tarihi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Input
                    id="issueDate"
                    type="text"
                    value={
                      certificateData?.issueDate
                        ? new Date(
                            certificateData.issueDate
                          ).toLocaleDateString("tr-TR")
                        : ""
                    }
                    placeholder="Veriliş Tarihi Seçiniz"
                    readOnly
                    className="mt-2 bg-white border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 bg-gray-800 text-gray-300 border-gray-700">
                  <DatePicker onDateSelect={handleDateSelect} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Dosya Yükleme */}
            <div>
              <Label htmlFor="filePath">Dosya Yükle</Label>
              <Input
                id="filePath"
                name="filePath"
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={handleFileChange}
                className="mt-2"
              />
            </div>

            {/* Sertifika Göster Butonu */}
            {certificateData?.filePath && (
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(certificateData.filePath, "_blank")}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Sertifika Göster
                </Button>
              </div>
            )}

            {/* Gönder Butonu */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Yükleniyor..." : "Sertifika Güncelle"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <Footer />

      {/* Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bilgilendirme</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => router.push("/user/profile")}>Tamam</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserCertificateEditPage;
