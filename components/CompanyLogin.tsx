"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import companyAPI from "@/app/api/companyApi";

import BioLogoSvg from "@/public/images/bio-logo-light.svg";

const CompanyLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await companyAPI.login(formData);
      localStorage.setItem("token", response.data);
      router.push("/company");
    } catch (error) {
      console.error("Giriş hatası:", error);
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex w-11/12 max-w-6xl bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        {/* Sol Alan: Logo ve Açıklama */}
        <div className="w-1/2 hidden md:flex flex-col items-center justify-center bg-gray-700 p-8">
          <Image
            src={BioLogoSvg}
            alt="Logo Görseli"
            width={200}
            height={200}
            className="mb-6"
          />
          <h1 className="text-white text-2xl font-bold">Firma Girişi</h1>
          <p className="text-gray-400 text-center mt-4">
            İş ilanlarınızı kolayca yönetin ve başvurularınızı hızlıca kontrol edin.
          </p>
        </div>

        {/* Sağ Alan: Form */}
        <div className="w-full md:w-1/2 p-8">
          {/* Üst Menü */}
          <div className="flex justify-between items-center mb-8">
            <Image
              src="/images/logo-light.png"
              alt="Balıkesir Logo"
              width={150}
              height={50}
            />
            <div className="flex space-x-4">
              <a
                href="/"
                className="text-gray-400 hover:text-white transition duration-200"
              >
                Geri Dön
              </a>
            </div>
          </div>

          {/* Giriş Formu */}
          <h2 className="text-white text-2xl font-bold mb-6">FİRMA GİRİŞİ</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Firma E-Postanızı giriniz"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Parola"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            <div className="text-right">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Şifremi Unuttum?
              </a>
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              GİRİŞ YAP
            </Button>
          </form>

          {/* Kayıt Ol */}
          <div className="text-center text-gray-400 mt-4">
            Firma hesabınız yok mu?{" "}
            <a href="/company/register" className="text-blue-500 hover:underline">
              Firma Kaydı Yapın
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
