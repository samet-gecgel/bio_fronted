"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { userAPI } from "@/app/api";
import { useRouter } from "next/navigation";
import getIdFromToken from "@/utils/getIdFromToken";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DatePicker from "@/components/custom/DatePicker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Footer from "@/components/Footer";
import { MainNav } from "@/components/ui/navigation-menu";
import { BALIKESIR_DISTRICTS } from "@/utils/districts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const UserSettingsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const token = localStorage.getItem("token") as string;
  const userId = getIdFromToken(token) as string;

  const [userData, setUserData] = useState({
    fullName: "",
    tcKimlik: "",
    email: "",
    phone: "",
    birthDate: "",
    district: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!userId) {
      router.push("/user/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await userAPI.getById(userId);
        const data = response.data;
        setUserData({
          fullName: data.fullName,
          tcKimlik: data.tcKimlik,
          email: data.email,
          phone: data.phone,
          birthDate: data.birthDate,
          district: data.district,
        });
      } catch (error) {
        console.error("Kullanıcı bilgileri alınırken hata:", error);
        toast({
          title: "Hata",
          description: "Kullanıcı bilgileri alınırken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, userId]);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      await userAPI.update(userId, userData);
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
      await userAPI.updatePassword(
        userId,
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
        setPasswordError("Parola güncellenirken bir hata oluştu.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Bilgilerimi Güncelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div>
                <label htmlFor="fullName">Ad Soyad</label>
                <Input
                  id="fullName"
                  type="text"
                  value={userData.fullName}
                  onChange={(e) =>
                    setUserData({ ...userData, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="tcKimlik">T.C. Kimlik</label>
                <Input
                  id="tcKimlik"
                  type="text"
                  value={userData.tcKimlik}
                  onChange={(e) =>
                    setUserData({ ...userData, tcKimlik: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="email">E-posta</label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="phone">Telefon</label>
                <Input
                  id="phone"
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                />
              </div>
              {/* Doğum Tarihi */}
              <div className="col-span-2 md:col-span-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Input
                      type="text"
                      value={
                        userData.birthDate
                          ? new Date(userData.birthDate).toLocaleDateString(
                              "tr-TR"
                            )
                          : ""
                      }
                      placeholder="Doğum Tarihi Seçiniz"
                      readOnly
                      className="mt-2 bg-white border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4 bg-gray-800 text-gray-300 border-gray-700">
                  <DatePicker
                      onDateSelect={(date) =>
                        setUserData({
                          ...userData,
                          birthDate: date.toISOString(),
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label htmlFor="district">İlçe</label>
                <Select
                  value={userData.district}
                  onValueChange={(value) =>
                    setUserData({ ...userData, district: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bir ilçe seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {BALIKESIR_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={updateLoading}>
                {updateLoading ? "Güncelleniyor..." : "Bilgileri Güncelle"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Parola Değiştir</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword">Mevcut Parola</label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="newPassword">Yeni Parola</label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="confirmPassword">Yeni Parola (Tekrar)</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              {passwordError && (
                <div className="text-red-500">{passwordError}</div>
              )}
              <Button type="submit" disabled={passwordLoading}>
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
      <Footer />
    </div>
  );
};

export default UserSettingsPage;
