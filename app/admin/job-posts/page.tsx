"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobFilters } from "@/components/custom/SuperAdminComponents/JobList/JobFilters";
import { JobTable } from "@/components/custom/SuperAdminComponents/JobList/JobTable";
import { PaginationCustom } from "@/components/custom/PaginationCustom";
import { IJobPost } from "@/types/jobpost";
import { ApplicationStatus } from "@/types/enums/applicationStatus";
import { useRouter } from "next/navigation";
import JobPostApi from "@/app/api/jobPostApi"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { AdminSidebar } from "@/components/custom/SuperAdminComponents/AdminSidebar";
import getRoleFromToken from "@/utils/getRoleFromTokens";

const JobListPage = () => {
  const [allJobs, setAllJobs] = useState<IJobPost[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<IJobPost[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const itemsPerPage = 8;

  const router = useRouter();

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

  const fetchJobs = async (page: number) => {
    setLoading(true);
    try {
      const response = await JobPostApi.getPaged(page, itemsPerPage);
      setAllJobs(response.data); 
      setTotalPages(response.totalPages); 
    } catch (error) {
      console.error("İş ilanları alınırken bir hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  useEffect(() => {
    let jobs = allJobs;

    if (selectedStatus !== null) {
      jobs = jobs.filter((job) => job.applicationStatus === selectedStatus);
    }

    if (searchTerm) {
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setTotalPages(Math.ceil(jobs.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    setFilteredJobs(jobs.slice(startIndex, startIndex + itemsPerPage));
  }, [allJobs, searchTerm, selectedStatus, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  console.log("filteredJobs", filteredJobs);
  

  const handleDelete = async (id: string) => {
    setSelectedJobId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedJobId) return;

    setDeleteLoading(true);
    try {
      await JobPostApi.delete(selectedJobId);
      toast({
        title: "Başarılı",
        description: "İş ilanı başarıyla silindi.",
      });
      fetchJobs(currentPage);
    } catch (error) {
      console.error("İş ilanı silinirken hata:", error);
      toast({
        title: "Hata",
        description: "İş ilanı silinirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setSelectedJobId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="overflow-y-hidden">
        <AdminSidebar />
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
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            ) : (
              <JobTable
                jobs={filteredJobs}
                onEdit={(id) => router.push(`/admin/job-posts/edit/${id}`)}
                onDelete={handleDelete}
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İş İlanını Sil</DialogTitle>
          </DialogHeader>
          <p>Bu iş ilanını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Siliniyor..." : "Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobListPage;
