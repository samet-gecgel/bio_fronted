"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import BioLogoSvg from "@/public/images/bio-logo-light.svg";
import { useRouter } from "next/navigation";
import { userAPI } from "@/app/api";
import DatePicker from "./custom/DatePicker";
import { BALIKESIR_DISTRICTS } from "@/utils/districts";

const UserRegister = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    tcKimlik: "",
    email: "",
    phone: "",
    district: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDistrictChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      district: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Parolalar eşleşmiyor!");
      return;
    }

    setErrorMessage(null);

    try {
      const userData = {
        fullName: formData.fullName,
        tcKimlik: formData.tcKimlik,
        email: formData.email,
        phone: formData.phone,
        birthDate: selectedDate?.toISOString() || "",
        district: formData.district,
        password: formData.password,
      };

      await userAPI.create(userData);
      router.push("/user/login");
    } catch (error) {
      console.error("Kayıt hatası: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex w-11/12 max-w-6xl bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Sol Alan: Görsel */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-gray-700 text-white p-8">
          <Image
            src={BioLogoSvg}
            alt="Logo Görseli"
            width={200}
            height={200}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Üye Kaydı Oluştur</h1>
          <p className="text-sm text-center leading-relaxed">
            Bu sayfadan danışmanlarımıza kayıt bilgilerinizi gönderebilirsiniz.
          </p>
        </div>

        {/* Sağ Alan: Form */}
        <div className="w-full md:w-1/2 p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Ad Soyad */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Adınız ve Soyadınız"
                className="bg-gray-800 border border-gray-700 text-gray-300"
              />
            </div>
            {/* T.C. Kimlik No */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="text"
                name="tcKimlik"
                value={formData.tcKimlik}
                onChange={handleInputChange}
                placeholder="11 Haneli T.C. Kimlik Numarası"
                className="bg-gray-800 border border-gray-700 text-gray-300"
              />
            </div>
            {/* Email */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="örnek@gmail.com"
                className="bg-gray-800 border border-gray-700 text-gray-300"
              />
            </div>
            {/* Telefon */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="555 555 5555"
                className="bg-gray-800 border border-gray-700 text-gray-300"
              />
            </div>
            {/* Doğum Tarihi */}
            <div className="col-span-2 md:col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Input
                    type="text"
                    value={
                      selectedDate
                        ? selectedDate.toLocaleDateString("tr-TR")
                        : ""
                    }
                    placeholder="Doğum Tarihi Seçiniz"
                    readOnly
                    className="bg-gray-800 border border-gray-700 text-gray-300 cursor-pointer"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 bg-gray-800 text-gray-300 border-gray-700">
                  <DatePicker onDateSelect={setSelectedDate} />
                </PopoverContent>
              </Popover>
            </div>
            {/* İlçe */}
            <div className="col-span-2 md:col-span-1">
              <Select onValueChange={handleDistrictChange}>
                <SelectTrigger className="bg-gray-800 border border-gray-700 text-gray-300">
                  <SelectValue placeholder="Bulunduğunuz İlçe" />
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
            {/* Parola */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Parolanız"
                className="bg-gray-800 border border-gray-700 text-gray-300"
              />
            </div>
            {/* Parola Tekrar */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Parola Tekrar"
                className="bg-gray-800 border border-gray-700 text-gray-300"
              />
            </div>
            {/* Aydınlatma Metni */}
            <div className="col-span-2 flex items-center">
              <Checkbox
                id="agreement"
                className="bg-gray-800 border-gray-700"
              />
              <label htmlFor="agreement" className="ml-2 text-gray-300">
                Aydınlatma Metnini okudum, onaylıyorum.
              </label>
            </div>
            {/* Hata Mesajı */}
            {errorMessage && (
              <div className="col-span-2 text-red-500 text-sm text-center">
                {errorMessage}
              </div>
            )}
            {/* Kayıt Ol */}
            <div className="col-span-2">
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Kayıt Ol
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
