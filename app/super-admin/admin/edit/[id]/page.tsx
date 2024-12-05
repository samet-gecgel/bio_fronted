"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SuperAdminSidebar } from "@/components/custom/SuperAdminComponents/SuperAdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { IAdmin } from "@/types/admin";
import { UserRole } from "@/types/enums/userRole";
import { adminAPI } from "@/app/api";
import getRoleFromToken from "@/utils/getRoleFromTokens";

const AdminEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const adminId = params.id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const role = getRoleFromToken(token);
    if (role !== "SuperAdmin") {
      router.push("/");
      return;
    }
  }, [router]);

  const [adminData, setAdminData] = useState<Omit<IAdmin, "id" | "createdAt">>({
    fullName: "",
    email: "",
    department: "",
    password: "",
    role: UserRole.Admin,
    updatedAt: undefined,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Token bulunamadı, lütfen giriş yapın.");
          router.push("/admin/login");
          return;
        }

        if (!adminId) {
          setError("Admin ID bulunamadı.");
          return;
        }

        setLoading(true);

        const response = await adminAPI.getById(adminId);
        const admin = response.data;

        setAdminData({
          fullName: admin.fullName,
          email: admin.email,
          department: admin.department,
          password: "",
          role: admin.role,
          updatedAt: admin.updatedAt,
        });

        setError(null);
      } catch (err: any) {
        setError(err.message || "Bilinmeyen bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [adminId, router]);

  const handleInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token bulunamadı, lütfen giriş yapın.");
        return;
      }

      await adminAPI.update(adminId, adminData);
      setDialogMessage("Bilgiler başarıyla güncellendi!");
      setShowDialog(true);
    } catch (err: any) {
      setError(err.message || "Bilgi güncelleme sırasında bir hata oluştu.");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setDialogMessage("Yeni parolalar eşleşmiyor!");
      setShowDialog(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token bulunamadı, lütfen giriş yapın.");
        return;
      }

      await adminAPI.updatePassword(
        adminId,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setDialogMessage("Parola başarıyla güncellendi!");
      setShowDialog(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err: any) {
      setError(err.message || "Parola güncelleme sırasında bir hata oluştu.");
    }
  };

  const handleInputChange = (field: keyof IAdmin, value: string) => {
    setAdminData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-screen">
        <div className="overflow-y-hidden">
          <SuperAdminSidebar />
        </div>
        <div className="flex-1 p-4 pt-6 md:p-8">
          <Skeleton className="h-10 w-1/4 mb-6" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-12 w-1/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="overflow-y-hidden">
        <SuperAdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-6 md:p-8">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Admin Bilgilerini Güncelle
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Update Info Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              Bilgileri Güncelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleInfoUpdate}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ad Soyad
                </label>
                <Input
                  type="text"
                  value={adminData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Adınızı ve soyadını girin"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-posta Adresi
                </label>
                <Input
                  type="email"
                  value={adminData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="E-posta adresini girin"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Departman
                </label>
                <Input
                  type="text"
                  value={adminData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  placeholder="Departman girin"
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Bilgileri Güncelle
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              Parola Değiştir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handlePasswordUpdate}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mevcut Parola
                </label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Mevcut parolayı girin"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Yeni Parola
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Yeni parolayı girin"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Yeni Parola (Tekrar)
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmNewPassword: e.target.value,
                    })
                  }
                  placeholder="Yeni parolayı tekrar girin"
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Parolayı Değiştir
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bilgilendirme</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setShowDialog(false)}>Tamam</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminEditPage;
