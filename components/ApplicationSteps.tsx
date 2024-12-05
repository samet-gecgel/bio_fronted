import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ApplicationSteps = () => {
  const steps = [
    {
      id: 1,
      title: "NASIL BAŞVURU YAPABİLİRİM?",
      description: "Başvuru süreci hakkında detaylı bilgi alın.",
      image: "/images/cards/card-1.png",
    },
    {
      id: 2,
      title: "Hemen Ücretsiz Üye Olun",
      description:
        "Ücretsiz üye olun ve özgeçmişinizi/ilanınızı kolayca oluşturun.",
      image: "/images/cards/card-2.png",
    },
    {
      id: 3,
      title: "Kariyer Danışmanınıza Başvurun",
      description:
        "Kariyer Danışmanlarımız ile iletişime geçerek iş/personel bulma süreçlerinizde destek alın.",
      image: "/images/cards/card-3.png",
    },
    {
      id: 4,
      title: "Yeni İşinize / Çalışana Ulaşın",
      description:
        "Balıkesir İstihdam Ofisi portalı üzerinden size en uygun işi / adayı bulun.",
      image: "/images/cards/card-4.png",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 px-4 md:px-16 py-8">
      {steps.map((step) => (
        <Card
          key={step.id}
          className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group aspect-square"
        >
          {/* Background Image */}
          <Image
            src={step.image}
            alt={step.title}
            layout="fill"
            objectFit="contain"
            className="absolute inset-0 z-0 opacity-70 group-hover:opacity-90 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70 z-0"></div>
          <CardContent className="relative z-10 text-white p-4 flex flex-col justify-end">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{step.title}</CardTitle>
            </CardHeader>
            {step.description && (
              <p className="mt-2 text-sm text-gray-200">{step.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationSteps;
