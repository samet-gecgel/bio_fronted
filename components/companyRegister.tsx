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
import companyAPI from "@/app/api/companyApi";
import { useRouter } from "next/navigation";
import DatePicker from "./custom/DatePicker";
import { BALIKESIR_DISTRICTS } from "@/utils/districts";

enum EmployeesRange {
  None = 0,
  OneToFive = 1,
  SixToTen = 2,
  ElevenToTwenty = 4,
  TwentyOneToFifty = 8,
  FiftyOneToOneHundred = 16,
  OverOneHundred = 32,
}

const CompanyRegister: React.FC = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [employeesInCity, setEmployeesInCity] = useState<EmployeesRange | null>(
    null
  );
  const [employeesInCountry, setEmployeesInCountry] =
    useState<EmployeesRange | null>(null);
  const [formData, setFormData] = useState({
    tcKimlik: "",
    vkn: "",
    fullName: "",
    phone: "",
    email: "",
    companyName: "",
    position: "",
    district: "",
    password: "",
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

    try {
      const companyData = {
        tcKimlik: formData.tcKimlik,
        vkn: formData.vkn,
        fullName: formData.fullName,
        phone: formData.phone,
        birthDate: selectedDate?.toISOString() || "",
        email: formData.email,
        companyName: formData.companyName,
        position: formData.position,
        district: formData.district,
        password: formData.password,
        employeesInCity: employeesInCity || EmployeesRange.None,
        employeesInCountry: employeesInCountry || EmployeesRange.None,
      };

      await companyAPI.create(companyData);
      router.push("/company/login");
    } catch (error) {
      console.error("Kayıt hatası:", error);
    }
  };

  console.log("date", selectedDate);
  
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
          <h1 className="text-3xl font-bold mb-4">Firma Kaydı Oluştur</h1>
          <p className="text-sm text-center leading-relaxed">
            Firma ve kişisel bilgilerinizi eksiksiz doldurunuz.
          </p>
        </div>

        {/* Sağ Alan: Form */}
        <div className="w-full md:w-1/2 p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* T.C. Kimlik No */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="text"
                name="tcKimlik"
                value={formData.tcKimlik}
                onChange={handleInputChange}
                placeholder="T.C. Kimlik Numarası"
                className="bg-gray-800 border border-gray-700 text-gray-300"
              />
            </div>
            {/* VKN */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="text"
                name="vkn"
                value={formData.vkn}
                onChange={handleInputChange}
                placeholder="Vergi Kimlik Numarası (VKN)"
                className="bg-gray-800 border border-gray-700 text-gray-300"
              />
            </div>
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
            {/* Telefon */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Telefon Numarası"
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
                placeholder="E-posta Adresiniz"
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

            {/* Şirket Adı */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Şirket Adı"
                className="bg-gray-800 border border-gray-700 text-gray-300"
              />
            </div>
            {/* Şirket Pozisyonu */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Şirketteki Pozisyonunuz"
                className="bg-gray-800 border border-gray-700 text-gray-300"
              />
            </div>
            {/* İlçe */}
            <div className="col-span-2 md:col-span-1">
            <Select onValueChange={handleDistrictChange}>
                <SelectTrigger className="bg-gray-800 border border-gray-700 text-gray-300">
                  <SelectValue placeholder="Firmanın Bulunduğu İlçe" />
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
            {/* Şifre */}
            <div className="col-span-2 md:col-span-1">
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Şifre"
                className="bg-gray-800 border border-gray-700 text-gray-300"
              />
            </div>
            {/* Balıkesir'deki Çalışan Sayısı */}
            <div className="col-span-2 md:col-span-1">
              <Select
                onValueChange={(value) =>
                  setEmployeesInCity(Number(value) as EmployeesRange)
                }
              >
                <SelectTrigger className="bg-gray-800 border border-gray-700 text-gray-300">
                  <SelectValue placeholder="Balıkesir'deki Çalışan Sayısı" />
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
            {/* Türkiye'deki Çalışan Sayısı */}
            <div className="col-span-2 md:col-span-1">
              <Select
                onValueChange={(value) =>
                  setEmployeesInCountry(Number(value) as EmployeesRange)
                }
              >
                <SelectTrigger className="bg-gray-800 border border-gray-700 text-gray-300">
                  <SelectValue placeholder="Türkiye'deki Çalışan Sayısı" />
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

export default CompanyRegister;