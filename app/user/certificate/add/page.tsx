"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

const UserCertificateAddPage = () => {
  const [certificateData, setCertificateData] = useState({
    certificateName: "",
    institution: "",
    issueDate: "",
    filePath: null as File | null,
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const router = useRouter();

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
  }, [router]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("certificateName", certificateData.certificateName);
      formData.append("institution", certificateData.institution);
      formData.append(
        "issueDate",
        selectedDate ? selectedDate.toISOString().split("T")[0] : ""
      );
      if (certificateData.filePath) {
        formData.append("filePath", certificateData.filePath);
      }

      await certificateAPI.create(formData);

      setDialogMessage("Sertifika başarıyla oluşturuldu.");
      setDialogOpen(true);

      setCertificateData({
        certificateName: "",
        institution: "",
        issueDate: "",
        filePath: null,
      });
      setSelectedDate(undefined);
    } catch (err: any) {
      setDialogMessage(err.message || "Sertifika eklenirken bir hata oluştu.");
      setDialogOpen(true);
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

  const handleDialogClose = () => {
    setDialogOpen(false);
    router.push("/user/profile");
  };

  return (
    <div>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Sertifika Oluştur
        </h2>
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
                value={certificateData.certificateName}
                onChange={(e) =>
                  setCertificateData({
                    ...certificateData,
                    certificateName: e.target.value,
                  })
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
                value={certificateData.institution}
                onChange={(e) =>
                  setCertificateData({
                    ...certificateData,
                    institution: e.target.value,
                  })
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
                      selectedDate
                        ? selectedDate.toLocaleDateString("tr-TR")
                        : ""
                    }
                    placeholder="Veriliş Tarihi Seçiniz"
                    readOnly
                    className="mt-2 bg-white border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 bg-gray-800 text-gray-300 border-gray-700">
                  <DatePicker onDateSelect={setSelectedDate} />
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
                required
              />
            </div>

            {/* Gönder Butonu */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Yükleniyor..." : "Sertifika Oluştur"}
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
            <Button onClick={handleDialogClose}>Tamam</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserCertificateAddPage;
