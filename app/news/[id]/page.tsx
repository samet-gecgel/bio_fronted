'use client';

import { useParams } from 'next/navigation';
import { MainNav } from '@/components/ui/navigation-menu';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { INews } from '@/types/news'; 
import { Skeleton } from '@/components/ui/skeleton'; 
import { newsAPI } from '@/app/api';
import { formatDate } from '@/utils/formatDate';

export default function NewsDetailPage() {
  const params = useParams();
  const [newsDetail, setNewsDetail] = useState<INews | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true); 
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (id) {
          const response = await newsAPI.getById(id); 
          setNewsDetail(response.data); 
          console.log("response burada", response);
        }
      } catch (error: any) {
        console.error('Haber detayı alınırken bir hata oluştu:', error.message || error);
        setNewsDetail(null);
      } finally {
        setLoading(false); 
      }
    };

    fetchNewsDetail();
  }, [params.id]);



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNav />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-8">
            <Skeleton className="w-full h-64 rounded-md" />
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!newsDetail) {
    return <p>Haber bulunamadı.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="w-full h-96 relative">
            <Image 
              src={newsDetail.imagePath}
              alt={newsDetail.title} 
              fill
              className="object-contain rounded-md shadow-sm"
              unoptimized
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">{newsDetail.title}</h1>
          <p className="text-sm text-gray-500">
            Yayınlanma Tarihi: {formatDate(newsDetail.createdAt)}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">{newsDetail.description}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
