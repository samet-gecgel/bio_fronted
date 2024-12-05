"use client";

import React, { useEffect, useState } from "react";
import { SuperAdminSidebar } from "@/components/custom/SuperAdminComponents/SuperAdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IAdmin } from "@/types/admin";
import { AdminFilters } from "@/components/custom/SuperAdminComponents/Admin/AdminFilters";
import { PaginationCustom } from "@/components/custom/PaginationCustom";
import { AdminTable } from "@/components/custom/SuperAdminComponents/Admin/AdminTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { adminAPI } from "@/app/api";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const AdminListPage = () => {
  const [allAdmins, setAllAdmins] = useState<IAdmin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<IAdmin[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  const itemsPerPage = 8;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const role = getRoleFromToken(token);
    if (role !== "SuperAdmin") {
      router.push("/");
      return;
    }
  }, [router]);

  const fetchAdmins = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await adminAPI.getPaged(pageNumber, itemsPerPage);
      setAllAdmins(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Adminler alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async () => {
    if (!selectedAdminId) return;

    try {
      await adminAPI.delete(selectedAdminId);
      setDialogMessage("Admin başarıyla silindi!");
      setShowDialog(true);

      fetchAdmins(currentPage);
    } catch (error) {
      console.error("Admin silme hatası:", error);
      setDialogMessage("Admin silme işlemi başarısız!");
      setShowDialog(true);
    } finally {
      setSelectedAdminId(null);
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredAdmins(
        allAdmins.filter(
          (admin) =>
            admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredAdmins(allAdmins);
    }
  }, [searchTerm, allAdmins]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SuperAdminSidebar />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-6 md:p-8">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-bold">Adminler</CardTitle>
            <Button
              variant="default"
              onClick={() => router.push("/super-admin/admin/add")}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Admin Ekle
            </Button>
          </CardHeader>
        </Card>

        {/* Filters and Table */}
        <Card className="flex flex-col min-h-[calc(100vh-180px)]">
          <CardContent className="p-6">
            <AdminFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            {loading ? (
              <p>Yükleniyor...</p>
            ) : (
              <>
                <AdminTable
                  admins={filteredAdmins}
                  onEdit={(id) => router.push(`/super-admin/admin/edit/${id}`)}
                  onDelete={(id) => {
                    setSelectedAdminId(id);
                    setDialogMessage(
                      "Bu admini silmek istediğinize emin misiniz?"
                    );
                    setShowDialog(true);
                  }}
                />
                <PaginationCustom
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Alert Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bilgilendirme</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setDialogMessage("");
              }}
            >
              İptal
            </Button>

            <Button
              variant="default"
              onClick={() => {
                setShowDialog(false);
                deleteAdmin(); 
              }}
            >
              Tamam
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      ;
    </div>
  );
};

export default AdminListPage;
