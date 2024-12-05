"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { companyAPI } from "@/app/api";
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
import { BALIKESIR_DISTRICTS } from "@/utils/districts";
import { EmployeesRange } from "@/types/enums/employeesRange";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Footer from "@/components/Footer";
import { CompanySidebar } from "@/components/custom/CompanyComponents/CompanySidebar";

const CompanySettingsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const token = localStorage.getItem("token") as string;
  const companyId = getIdFromToken(token) as string;

  const [companyData, setCompanyData] = useState({
    tcKimlik: "",
    vkn: "",
    fullName: "",
    phone: "",
    birthDate: "",
    email: "",
    companyName: "",
    position: "",
    district: "",
    employeesInCity: EmployeesRange.None,
    employeesInCountry: EmployeesRange.None,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!companyId) {
      router.push("/company/login");
      return;
    }

    const fetchCompanyData = async () => {
      try {
        const response = await companyAPI.getById(companyId);
        const data = response.data;
        setCompanyData({
          tcKimlik: data.tcKimlik,
          vkn: data.vkn,
          fullName: data.fullName,
          phone: data.phone,
          birthDate: data.birthDate,
          email: data.email,
          companyName: data.companyName,
          position: data.position,
          district: data.district,
          employeesInCity: data.employeesInCity,
          employeesInCountry: data.employeesInCountry,
        });
      } catch (error) {
        console.error("Şirket bilgileri alınırken hata:", error);
        toast({
          title: "Hata",
          description: "Şirket bilgileri alınırken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [router, companyId]);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      await companyAPI.update(companyId, companyData);
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
      await companyAPI.updatePassword(companyId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
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
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed hidden lg:block h-screen w-[240px]">
        <CompanySidebar />
      </div>
      <div className="flex-1 lg:ml-[240px] p-8 overflow-y-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Şirket Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateInfo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tcKimlik">T.C. Kimlik Numarası</label>
                <Input
                  id="tcKimlik"
                  type="text"
                  value={companyData.tcKimlik}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, tcKimlik: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="vkn">Vergi Kimlik Numarası (VKN)</label>
                <Input
                  id="vkn"
                  type="text"
                  value={companyData.vkn}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, vkn: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="fullName">Adınız ve Soyadınız</label>
                <Input
                  id="fullName"
                  type="text"
                  value={companyData.fullName}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="phone">Telefon Numarası</label>
                <Input
                  id="phone"
                  type="text"
                  value={companyData.phone}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="birthDate">Doğum Tarihi</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Input
                      id="birthDate"
                      type="text"
                      value={
                        companyData.birthDate
                          ? new Date(companyData.birthDate).toLocaleDateString(
                              "tr-TR"
                            )
                          : ""
                      }
                      readOnly
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <DatePicker
                      onDateSelect={(date) =>
                        setCompanyData({
                          ...companyData,
                          birthDate: date.toISOString(),
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="email">E-posta</label>
                <Input
                  id="email"
                  type="email"
                  value={companyData.email}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="companyName">Şirket Adı</label>
                <Input
                  id="companyName"
                  type="text"
                  value={companyData.companyName}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, companyName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="district">Firmanın Bulunduğu İlçe</label>
                <Select
                  value={companyData.district}
                  onValueChange={(value) =>
                    setCompanyData({ ...companyData, district: value })
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
              <div>
                <label htmlFor="employeesInCity">
                  Balıkesir’deki Çalışan Sayısı
                </label>
                <Select
                  value={companyData.employeesInCity.toString()}
                  onValueChange={(value) =>
                    setCompanyData({
                      ...companyData,
                      employeesInCity: Number(value) as EmployeesRange,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value={EmployeesRange.OneToFive.toString()}>
                    1-5
                  </SelectItem>
                  <SelectItem value={EmployeesRange.SixToTen.toString()}>
                    6-10
                  </SelectItem>
                  <SelectItem value={EmployeesRange.ElevenToTwenty.toString()}>
                    11-20
                  </SelectItem>
                  <SelectItem
                    value={EmployeesRange.TwentyOneToFifty.toString()}
                  >
                    21-50
                  </SelectItem>
                  <SelectItem
                    value={EmployeesRange.FiftyOneToOneHundred.toString()}
                  >
                    51-100
                  </SelectItem>
                  <SelectItem value={EmployeesRange.OverOneHundred.toString()}>
                    100+
                  </SelectItem>
                </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="employeesInCountry">
                  Türkiye’deki Çalışan Sayısı
                </label>
                <Select
                  value={companyData.employeesInCountry.toString()}
                  onValueChange={(value) =>
                    setCompanyData({
                      ...companyData,
                      employeesInCountry: Number(value) as EmployeesRange,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value={EmployeesRange.OneToFive.toString()}>
                    1-5
                  </SelectItem>
                  <SelectItem value={EmployeesRange.SixToTen.toString()}>
                    6-10
                  </SelectItem>
                  <SelectItem value={EmployeesRange.ElevenToTwenty.toString()}>
                    11-20
                  </SelectItem>
                  <SelectItem
                    value={EmployeesRange.TwentyOneToFifty.toString()}
                  >
                    21-50
                  </SelectItem>
                  <SelectItem
                    value={EmployeesRange.FiftyOneToOneHundred.toString()}
                  >
                    51-100
                  </SelectItem>
                  <SelectItem value={EmployeesRange.OverOneHundred.toString()}>
                    100+
                  </SelectItem>
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
    </div>
  );
};

export default CompanySettingsPage;
