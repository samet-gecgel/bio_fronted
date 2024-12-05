'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { MainNav } from '@/components/ui/navigation-menu';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { PaginationCustom } from '@/components/custom/PaginationCustom';
import { INews } from '@/types/news'; 
import { newsAPI } from '../api';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [newsData, setNewsData] = useState<INews[]>([]); 
  const [totalPages, setTotalPages] = useState<number>(1); 
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true); 
      try {
        const response = await newsAPI.getPaged(currentPage, 10); 
        setNewsData(response.data); 
        setTotalPages(response.totalPages); 
      } catch (error: any) {
        console.error('Haberler yüklenirken bir hata oluştu:', error.message || error);
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]); 

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  console.log('API Response:', newsData);


  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Haberler</h1>

        {loading ? (
          <div className="grid gap-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card 
                key={index} 
                className="flex flex-col md:flex-row overflow-hidden border border-gray-200 shadow-sm cursor-pointer"
              >
                <div className="md:w-1/3">
                  <Skeleton className="h-[300px] w-full" />
                </div>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <Skeleton className="h-4 w-full my-2" />
                    <Skeleton className="h-4 w-5/6 my-2" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : newsData && newsData.length > 0 ? (
          <div className="grid gap-8">
            {newsData.map((news: INews) => (
              <Card 
                key={news.id} 
                className="flex flex-col md:flex-row overflow-hidden border border-gray-200 shadow-sm cursor-pointer"
                onClick={() => router.push(`/news/${news.id}`)}
              >
                
                <div className="md:w-1/3">
                  <Image 
                    src={news.imagePath} 
                    alt={news.title} 
                    width={400} 
                    height={300} 
                    className="h-full w-full object-cover" 
                    unoptimized
                  />
                </div>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-gray-800">{news.title}</CardTitle>
                    </CardHeader>
                    <p className="text-base text-gray-600 line-clamp-3">
                      {news.description}
                    </p>
                  </div>
                  <Button 
                    className=" bg-blue-600 text-white hover:bg-blue-700 self-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/news/${news.id}`);
                    }}
                  >
                    Haberin Detayını Gör
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">Henüz haber bulunmamaktadır.</p>
        )}

        {/* Sayfa Numaralandırma */}
        <PaginationCustom
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      <Footer />
    </div>
  );
}
