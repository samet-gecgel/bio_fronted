"use client";

import React, { useEffect, useState } from "react";
import { SuperAdminSidebar } from "@/components/custom/SuperAdminComponents/SuperAdminSidebar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyHeader } from "@/components/custom/SuperAdminComponents/Company/CompanyHeader";
import { CompanyInfo } from "@/components/custom/SuperAdminComponents/Company/CompanyInfo";
import { JobPostsTable } from "@/components/custom/SuperAdminComponents/Company/JobPostsTable";
import { ApplicationStatus } from "@/types/enums/applicationStatus";
import companyAPI from "@/app/api/companyApi";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import getRoleFromToken from "@/utils/getRoleFromTokens";

const CompanyDetailPage = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<ApplicationStatus | null>(
    null
  );
  const [resultMessage, setResultMessage] = useState<string>("");

  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

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

    fetchCompanyData();
  }, [router]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getById(companyId);
      setCompanyData(response.data);
      console.log("company data", response.data);
      
    } catch (error) {
      console.error("Şirket bilgileri alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionConfirm = async () => {
    if (!dialogAction) return;

    setActionLoading(true);
    try {
      if (dialogAction === ApplicationStatus.Approved) {
        await companyAPI.approve(companyId);
        setCompanyData({ ...companyData, approvalStatus: ApplicationStatus.Approved });
        setResultMessage("Şirket başarıyla onaylandı!");
      } else if (dialogAction === ApplicationStatus.Rejected) {
        await companyAPI.reject(companyId);
        setCompanyData({ ...companyData, approvalStatus: ApplicationStatus.Rejected });
        setResultMessage("Şirket başarıyla reddedildi!");
      }
      setResultDialogOpen(true);
    } catch (error) {
      console.error("Durum güncelleme hatası:", error);
      setResultMessage("Durum güncellenirken bir hata oluştu.");
      setResultDialogOpen(true);
    } finally {
      setActionLoading(false);
      setDialogOpen(false);
    }
  };

  const openDialog = (action: ApplicationStatus) => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleJobPostDetails = (jobId) => {
    const selectedJobPost = companyData.jobPosts.find((job) => job.id === jobId);
    setJobPostDetails(selectedJobPost);
  };

  if (loading || !companyData) {
    return (
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
        <div className="overflow-y-hidden">
          <SuperAdminSidebar />
        </div>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Card className="mb-6">
            <div className="p-6">
              <Skeleton className="h-20 w-full" />
            </div>
          </Card>
          <Card className="mb-6">
            <div className="p-6">
              <Skeleton className="h-40 w-full" />
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <Skeleton className="h-60 w-full" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      <div className="overflow-y-hidden">
        <SuperAdminSidebar />
      </div>
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Şirket Başlığı */}
        <Card className="mb-6">
          <CompanyHeader company={companyData} />
        </Card>

        {/* Şirket Bilgileri */}
        <Card className="mb-6">
          <CompanyInfo company={companyData} />
        </Card>

        {/* Durum Güncelleme */}
        <Card className="mb-6 p-4">
          <h2 className="text-xl font-bold mb-4">Durum Güncelle</h2>
          <div className="flex space-x-4">
            <Button
              variant="default"
              className="bg-green-600 text-white"
              disabled={actionLoading || companyData.approvalStatus === ApplicationStatus.Approved}
              onClick={() => openDialog(ApplicationStatus.Approved)}
            >
              Onayla
            </Button>
            <Button
              variant="default"
              className="bg-red-600 text-white"
              disabled={actionLoading || companyData.approvalStatus === ApplicationStatus.Rejected}
              onClick={() => openDialog(ApplicationStatus.Rejected)}
            >
              Reddet
            </Button>
          </div>
        </Card>

        {/* İş İlanları */}
        <div className="py-4 px-2 text-xl font-medium">İş İlanları</div>
        <Card>
          <JobPostsTable
            jobPosts={companyData.jobPosts}
            onViewDetails={(jobId) => handleJobPostDetails(jobId)}
          />
        </Card>
      </div>

      {/* Onay ve Reddetme Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === ApplicationStatus.Approved
                ? "Şirketi onaylamak istiyor musunuz?"
                : "Şirketi reddetmek istiyor musunuz?"}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              İptal
            </Button>
            <Button
              variant={dialogAction === ApplicationStatus.Approved ? "default" : "destructive"}
              onClick={handleActionConfirm}
              disabled={actionLoading}
            >
              {actionLoading
                ? dialogAction === ApplicationStatus.Approved
                  ? "Onaylanıyor..."
                  : "Reddediliyor..."
                : dialogAction === ApplicationStatus.Approved
                ? "Onayla"
                : "Reddet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sonuç Dialog */}
      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{resultMessage}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setResultDialogOpen(false)}>Tamam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDetailPage;

