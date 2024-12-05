"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BALIKESIR_DISTRICTS } from "@/utils/districts";

   const JobSearchHero = () => {
  const [title, setTitle] = useState("");
  const [district, setDistrict] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (title) params.set("search", title);
    if (district) params.set("district", district);

    router.push(`/job-posts?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 px-4 md:px-16 py-8 md:py-16 space-y-6 md:space-y-0">
      {/* Sol Taraf - Yazı ve Arama */}
      <div className="flex flex-col items-start space-y-4 md:space-y-6 max-w-lg">
        <h1 className="text-2xl md:text-5xl font-bold text-gray-800 leading-tight">
          İlgi ve becerilerinize <br /> uygun bir iş bulun.
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Beceri ve deneyimlerinize en uygun işleri bulun. Hayalinizdeki işe bir
          adım daha yaklaşın.
        </p>

        {/* Arama Çubuğu */}
        <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg w-full space-y-2 md:space-y-0 md:space-x-2 p-4 md:p-0">
          {/* İlçe Seçimi */}
          <div className="w-full md:w-1/3">
            <Select onValueChange={(value) => setDistrict(value)}>
              <SelectTrigger className="w-full px-4 h-12 border-none outline-none focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="İlçe" />
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

          {/* İş Tanımı */}
          <Input
            type="text"
            placeholder="İş Tanımı, Anahtar Kelimeler..."
            className="w-full px-4 h-12 border-none outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Button */}
          <Button
            className="w-full md:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg md:rounded-none h-12"
            onClick={handleSearch}
          >
            İş Bul
          </Button>
        </div>

        {/* Öneriler */}
        <div className="text-sm text-gray-600 flex flex-wrap gap-2 mt-4">
          <span>Öneriler:</span>
          {[
            "Tasarım",
            "Programlama",
            "Dijital Pazarlama",
            "Video",
            "Animasyon",
          ].map((item, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-sm cursor-pointer hover:bg-blue-200"
              onClick={() => setTitle(item)}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Sağ Taraf - Görsel */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end">
        <Image
          src="/images/bio-url.png"
          alt="Bio"
          width={400}
          height={400}
          className="max-w-full max-h-[400px]"
          unoptimized
        />
      </div>
    </div>
  );
}

export default JobSearchHero;