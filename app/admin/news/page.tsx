"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { INews } from "@/types/news";
import { newsAPI } from "@/app/api";
import { PaginationCustom } from "@/components/custom/PaginationCustom";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { AdminSidebar } from "@/components/custom/SuperAdminComponents/AdminSidebar";

const NewsListPage: React.FC = () => {
  const [newsList, setNewsList] = useState<INews[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredNews, setFilteredNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  const itemsPerPage = 8;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
    }

    const role = getRoleFromToken(token);
    if (role !== "Admin") {
      router.push("/");
    }
  }, [router]);

  const fetchNews = async (page: number) => {
    setLoading(true);
    try {
      const response = await newsAPI.getPaged(page, itemsPerPage);
      setNewsList(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Haberler alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = newsList.filter(
        (news) =>
          news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews(newsList);
    }
  }, [searchTerm, newsList]);

  const handleDelete = async () => {
    if (!selectedNews) return;

    setDeleting(true);
    try {
      await newsAPI.delete(selectedNews);
      setDialogOpen(false);
      setSuccessDialogOpen(true);
      fetchNews(currentPage);
    } catch (error) {
      console.error("Haber silme hatası:", error);
    } finally {
      setDeleting(false);
      setSelectedNews(null);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedNews(id);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="overflow-y-hidden">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-6 md:p-8">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Haberler
            </CardTitle>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/admin/news/add")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Haber Ekle
            </Button>
          </CardHeader>
        </Card>

        {/* Search and Table */}
        <Card className="flex flex-col min-h-[calc(100vh-180px)]">
          <CardContent className="p-6">
            {/* Search Input */}
            <div className="mb-6 flex justify-between items-center">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Haber ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Skeleton */}
            {loading || deleting ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Haber Başlığı</TableHead>
                        <TableHead>Yazan Admin</TableHead>
                        <TableHead>Oluşturulma Tarihi</TableHead>
                        <TableHead>Aksiyonlar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNews.map((news) => (
                        <TableRow key={news.id}>
                          <TableCell>{news.title}</TableCell>
                          <TableCell>{news.adminName}</TableCell>
                          <TableCell>
                            {new Date(news.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() =>
                                  router.push(
                                    `/admin/news/edit/${news.id}`
                                  )
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => confirmDelete(news.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center">
                  <PaginationCustom
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page: number) => setCurrentPage(page)}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Onay Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Haber Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu haberi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="outline">
              İptal
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Sil
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Başarı Dialog */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Başarılı!</AlertDialogTitle>
            <AlertDialogDescription>
              Haber başarıyla silindi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setSuccessDialogOpen(false)}>Tamam</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewsListPage;
