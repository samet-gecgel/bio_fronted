"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/custom/SuperAdminComponents/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import adminAPI from "@/app/api/adminApi";
import { useRouter } from "next/navigation";
import getIdFromToken from "@/utils/getIdFromToken";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import getRoleFromToken from "@/utils/getRoleFromTokens";

const SettingsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const token = localStorage.getItem("token") as string;
  const adminId = getIdFromToken(token) as string;

  const [adminData, setAdminData] = useState({
    fullName: "",
    email: "",
    department: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!adminId) {
      router.push("/admin/login");
      return;
    }

    const role = getRoleFromToken(token);
    if (role !== "Admin") {
      router.push("/");
      return;
    }

    fetchAdminData();
  }, [adminId, router, token]);

  const fetchAdminData = async () => {
    try {
      const response = await adminAPI.getById(adminId);
      const data = response.data;
      setAdminData({
        fullName: data.fullName,
        email: data.email,
        department: data.department,
      });
    } catch (error) {
      console.error("Admin bilgileri alınırken hata:", error);
      toast({
        title: "Hata",
        description: "Admin bilgileri alınırken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      await adminAPI.update(adminId, adminData);
      setSuccessMessage("Bilgiler başarıyla güncellendi");
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error("Bilgiler güncellenirken hata:", error);
      toast({
        title: "Hata",
        description: "Bilgiler güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Yeni parolalar eşleşmiyor.");
      return;
    }

    setPasswordLoading(true);
    try {
      await adminAPI.updatePassword(
        adminId,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      setSuccessMessage("Parola başarıyla güncellendi");
      setSuccessDialogOpen(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      if (error.message.includes("Hatalı parola")) {
        setPasswordError("Mevcut parola yanlış.");
      } else {
        setPasswordError("Mevcut parola yanlış.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-screen">
        <div className="overflow-y-hidden">
          <AdminSidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
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
              Ayarlar
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Bilgilerimi Güncelle */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              Bilgilerimi Güncelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ad Soyad
                </label>
                <Input
                  type="text"
                  value={adminData.fullName}
                  onChange={(e) =>
                    setAdminData({ ...adminData, fullName: e.target.value })
                  }
                  placeholder="Adınızı ve soyadınızı girin"
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
                  onChange={(e) =>
                    setAdminData({ ...adminData, email: e.target.value })
                  }
                  placeholder="E-posta adresinizi girin"
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
                    setAdminData({ ...adminData, department: e.target.value })
                  }
                  placeholder="Departmanınızı girin"
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={updateLoading}
              >
                {updateLoading ? "Güncelleniyor..." : "Bilgileri Güncelle"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              Parola Değiştir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
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
                  placeholder="Mevcut parolanızı girin"
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
                  placeholder="Yeni parolanızı girin"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Yeni Parola (Tekrar)
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Yeni parolanızı tekrar girin"
                  className="mt-1"
                />
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}
              <Button
                type="submit"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Güncelleniyor..." : "Parolayı Değiştir"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Başarılı</DialogTitle>
          </DialogHeader>
          <p>{successMessage}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
