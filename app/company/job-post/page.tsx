"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobFilters } from "@/components/custom/SuperAdminComponents/JobList/JobFilters";
import { JobTable } from "@/components/custom/SuperAdminComponents/JobList/JobTable";
import { PaginationCustom } from "@/components/custom/PaginationCustom";
import { IJobPost } from "@/types/jobpost";
import { ApplicationStatus } from "@/types/enums/applicationStatus";
import { useRouter } from "next/navigation";
import { CompanySidebar } from "@/components/custom/CompanyComponents/CompanySidebar";
import { jobPostAPI } from "@/app/api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import getRoleFromToken from "@/utils/getRoleFromTokens";

const JobListPage = () => {
  const [allJobs, setAllJobs] = useState<IJobPost[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<IJobPost[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
 // const [totalItems, setTotalItems] = useState<number>(0);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const itemsPerPage = 8;

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/company/login");
      return;
    }

    const role = getRoleFromToken(token);
    if (role !== "Company") {

      router.push("/");
      return;
    }
  }, [router]);

    const fetchJobs = async (page: number) => {
      try {
        setLoading(true);
        const response = await jobPostAPI.getByCompanyIdPaged(page, itemsPerPage);
        console.log("data", response.data);
        
        setAllJobs(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("İş ilanları yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    const deleteJob = async () => {
      if (!selectedJobId) return;
    
      try {
        await jobPostAPI.delete(selectedJobId);
        setDialogMessage("İş ilanı başarıyla silindi!");
        setShowDialog(true);
        fetchJobs(currentPage);
      } catch (error) {
        console.error("İş ilanı silme hatası:", error);
        setDialogMessage("İş ilanı silme işlemi başarısız!");
        setShowDialog(true);
      } finally {
        setSelectedJobId(null);
      }
    };

  useEffect(() => {
    fetchJobs(currentPage)
  }, [currentPage])

  useEffect(() => {
    let jobs = allJobs;

    if (selectedStatus !== null) {
      jobs = jobs.filter((job) => job.applicationStatus === selectedStatus);
    }

    if (searchTerm) {
      jobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredJobs(jobs);
  }, [allJobs, searchTerm, selectedStatus]);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="overflow-y-hidden">
        <CompanySidebar />
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-6 md:p-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">İş İlanları</CardTitle>
          </CardHeader>
        </Card>
        <Card className="flex flex-col min-h-[calc(100vh-180px)]">
          <CardContent className="p-6">
            <JobFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <p>Yükleniyor...</p>
              </div>
            ) : (
              <>
                <JobTable
                  jobs={filteredJobs}
                  onEdit={(id) => router.push(`/company/job-post/edit/${id}`)}
                  onDelete={(id) => {
                    setSelectedJobId(id);
                    setDialogMessage("Bu iş ilanını silmek istediğinize emin misiniz?");
                    setShowDialog(true);
                  }}
                />
                <div className="mt-6 flex justify-center">
                  <PaginationCustom
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
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
            {selectedJobId && dialogMessage === "Bu iş ilanını silmek istediğinize emin misiniz?" && (
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDialog(false);
                  deleteJob();
                }}
              >
                Sil
              </Button>
            )}
            {dialogMessage !== "Bu iş ilanını silmek istediğinize emin misiniz?" && (
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

export default JobListPage;
