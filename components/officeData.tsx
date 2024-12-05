import React from "react";
import { MapPin, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Offices = () => {
  const officeData = [
    {
      district: "Altıeylül",
      name: "Altıeylül İstihdam Ofisi",
      address: "Gümüşçeşme Mah. Avlu Cad. No:28 Altıeylül/Balıkesir",
      link: "#",
    },
    {
      district: "Karesi",
      name: "Karesi İstihdam Ofisi",
      address: "Eski Kuyumcular Mah. Mekik Sokak No: 25 Karesi/Balıkesir",
      link: "#",
    },
  ];

  return (
    <div className="bg-white py-16 px-4 md:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Başlık ve Açıklama */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-semibold text-left text-blue-700 mb-4 tracking-tight">
            Ofislerimiz
          </h1>
          <p className="text-gray-600 text-left font-medium">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia,
            repudiandae? Lorem ipsum dolor sit amet consectetur, adipisicing
            elit. Ex vitae harum consectetur debitis assumenda rem magnam dolore
            explicabo, laboriosam modi!
          </p>
        </div>

        {/* Ofis Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {officeData.map((office, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition transform hover:-translate-y-1 h-80 flex flex-col justify-between"
            >
              <CardHeader>
                {/* Bölge Etiketi */}
                <div className="flex items-center justify-start mb-4">
                  <span className="bg-pink-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {office.district}
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                  {office.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Ofis Bilgileri */}
                <p className="text-gray-600 flex items-center mb-6">
                  <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                  {office.address}
                </p>
                {/* Yol Tarifi Butonu */}
                <Button
                  variant="outline"
                  className="flex justify-between items-center text-gray-800 font-medium w-full"
                  asChild
                >
                  <a href={office.link}>
                    Yol Tarifi Almak İçin Tıklayın
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offices;
