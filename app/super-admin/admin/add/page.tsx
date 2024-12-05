"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SuperAdminSidebar } from "@/components/custom/SuperAdminComponents/SuperAdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { IAdmin } from "@/types/admin";
import { adminAPI } from "@/app/api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import getRoleFromToken from "@/utils/getRoleFromTokens";

const AddAdminPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<IAdmin, "id" | "createdAt" | "role">>({
    fullName: "",
    email: "",
    department: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token bulunamadı, lütfen giriş yapın.");
        router.push("/admin/login");
        return;
      }

      const role = getRoleFromToken(token);
      if (role !== "SuperAdmin") {
        router.push("/");
        return;
      }

      setLoading(true);

      await adminAPI.create(formData);

      setDialogMessage("Admin başarıyla oluşturuldu!");
      setShowDialog(true);

      // Form verilerini sıfırla
      setFormData({
        fullName: "",
        email: "",
        department: "",
        password: "",
      });

      setTimeout(() => {
        setShowDialog(false);
        router.push("/super-admin/admin"); // Yönlendirme işlemi
      }, 2000);

      setError(null);
    } catch (err: any) {
      setError(err.message || "Admin oluşturma sırasında bir hata oluştu.");
      setDialogMessage(err.message);
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof IAdmin, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="overflow-y-hidden">
        <SuperAdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Admin Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <Label htmlFor="name" className="block mb-2 text-sm font-medium">
                  Ad Soyad
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ad Soyad"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <Label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              {/* Department Input */}
              <div>
                <Label
                  htmlFor="department"
                  className="block mb-2 text-sm font-medium"
                >
                  Departman
                </Label>
                <Input
                  id="department"
                  type="text"
                  placeholder="Departman"
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <Label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium"
                >
                  Şifre
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Şifre"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/super-admin/admin")}
                  type="button"
                >
                  İptal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Yükleniyor..." : "Kaydet"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Alert Dialog */}
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

export default AddAdminPage;
