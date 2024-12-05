"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginationCustom } from "@/components/custom/PaginationCustom";
import { useRouter } from "next/navigation";
import { CompanyFilters } from "@/components/custom/SuperAdminComponents/Company/CompanyFilters";
import { CompanyTable } from "@/components/custom/SuperAdminComponents/Company/CompanyTable";
import { ApplicationStatus } from "@/types/enums/applicationStatus";
import { ICompany } from "@/types/company";
import companyAPI from "@/app/api/companyApi";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import { AdminSidebar } from "@/components/custom/SuperAdminComponents/AdminSidebar";

const CompanyListPage: React.FC = () => {
  const [allCompanies, setAllCompanies] = useState<ICompany[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<ICompany[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const itemsPerPage = 8;

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const role = getRoleFromToken(token);
    if (role !== "Admin") {

      router.push("/");
      return;
    }
  }, [router]);

  const fetchCompanies = async (page: number) => {
    setLoading(true);
    try {
      const response = await companyAPI.getPaged(page, itemsPerPage);
      setAllCompanies(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Şirketler alınırken bir hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async () => {
    if (!selectedCompanyId) return;

    try {
      await companyAPI.delete(selectedCompanyId);
      setDialogMessage("Şirket başarıyla silindi!");
      setShowDialog(true);
      fetchCompanies(currentPage);
    } catch (error) {
      console.error("Şirket silme hatası:", error);
      setDialogMessage("Şirket silme işlemi başarısız!");
      setShowDialog(true);
    } finally {
      setSelectedCompanyId(null);
    }
  };

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage]);

  useEffect(() => {
    let companies = allCompanies;

    if (selectedStatus !== null) {
      companies = companies.filter(
        (company) => company.approvalStatus === selectedStatus
      );
    }

    if (searchTerm) {
      companies = companies.filter(
        (company) =>
          company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCompanies(companies);
  }, [allCompanies, searchTerm, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(
      value === "Tümü" ? null : (parseInt(value, 10) as ApplicationStatus)
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="overflow-y-hidden">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-6 md:p-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Şirketler
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="flex flex-col min-h-[calc(100vh-180px)]">
          <CardContent className="p-6">
            <CompanyFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedStatus={selectedStatus}
              setSelectedStatus={handleStatusChange}
            />

            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            ) : (
              <CompanyTable
                companies={filteredCompanies}
                onEdit={(id) => router.push(`/admin/companies/edit/${id}`)}
                onDelete={(id) => {
                  setSelectedCompanyId(id);
                  setDialogMessage("Bu şirketi silmek istediğinize emin misiniz?");
                  setShowDialog(true);
                }}
              />
            )}
            <div className="mt-6 flex justify-center">
              <PaginationCustom
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
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
            {selectedCompanyId && dialogMessage === "Bu şirketi silmek istediğinize emin misiniz?" && (
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDialog(false);
                  deleteCompany();
                }}
              >
                Sil
              </Button>
            )}
            {dialogMessage !== "Bu şirketi silmek istediğinize emin misiniz?" && (
              <Button
                variant="default"
                onClick={() => {
                  setShowDialog(false);
                  setDialogMessage("");
                }}
              >
                Tamam
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompanyListPage;
