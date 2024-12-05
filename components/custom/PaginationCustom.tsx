import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number; // Aktif sayfa
  totalPages: number; // Toplam sayfa sayısı
  onPageChange: (page: number) => void; // Sayfa değişim işlevi
}

export const PaginationCustom: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null; // Tek sayfa varsa pagination gösterme

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const range = 2; // Aktif sayfanın etrafındaki sayfa sayısı
    const startPage = Math.max(2, currentPage - range); // 2'den başlamalı
    const endPage = Math.min(totalPages - 1, currentPage + range); // Son sayfadan önce bitmeli

    pages.push(1); // İlk sayfa
    if (startPage > 2) pages.push("..."); // Başlangıçta boşluk varsa

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) pages.push("..."); // Sonda boşluk varsa
    pages.push(totalPages); // Son sayfa

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
      {/* Önceki Sayfa */}
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 text-sm"
      >
        Önceki
      </Button>

      {/* Sayfa Numaraları */}
      {pages.map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={index}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 text-sm ${
              currentPage === page ? "bg-black text-white" : ""
            }`}
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="px-4 py-2 text-gray-500">
            ...
          </span>
        )
      )}

      {/* Sonraki Sayfa */}
      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 text-sm"
      >
        Sonraki
      </Button>
    </div>
  );
};
