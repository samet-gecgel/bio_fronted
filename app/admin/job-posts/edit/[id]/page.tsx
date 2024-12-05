"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobOverview } from "@/components/custom/SuperAdminComponents/JobList/JobOverview";
import { JobDetails } from "@/components/custom/SuperAdminComponents/JobList/JobDetails";
import { JobHeader } from "@/components/custom/SuperAdminComponents/JobList/JobHeader";
import { IJobPost } from "@/types/jobpost";
import { ApplicationStatus } from "@/types/enums/applicationStatus";
import { useParams, useRouter } from "next/navigation";
import JobPostApi from "@/app/api/jobPostApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import { AdminSidebar } from "@/components/custom/SuperAdminComponents/AdminSidebar";

const JobDetailPage: React.FC = () => {
  const [jobPostData, setJobPostData] = useState<IJobPost | null>(null);
  const [jobStatus, setJobStatus] = useState<ApplicationStatus>(
    ApplicationStatus.Pending
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogAction, setDialogAction] = useState<ApplicationStatus | null>(
    null
  );
  const [resultMessage, setResultMessage] = useState<string>("");
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

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

  useEffect(() => {
    const fetchJobPost = async () => {
      setLoading(true);
      try {
        const response = await JobPostApi.getById(jobId);
        setJobPostData(response.data);
        setJobStatus(response.data.applicationStatus);
      } catch (error) {
        console.error("İş ilanı alınırken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPost();
  }, [jobId]);

  // Durum güncelleme
  const handleActionConfirm = async () => {
    if (!dialogAction) return;

    setActionLoading(true);
    try {
      if (dialogAction === ApplicationStatus.Approved) {
        await JobPostApi.approve(jobId);
        setJobStatus(ApplicationStatus.Approved);
        setResultMessage("İş ilanı başarıyla onaylandı!");
      } else if (dialogAction === ApplicationStatus.Rejected) {
        await JobPostApi.reject(jobId);
        setJobStatus(ApplicationStatus.Rejected);
        setResultMessage("İş ilanı başarıyla reddedildi!");
      }
    } catch (error) {
      console.error("Durum güncellenirken bir hata oluştu:", error);
      setResultMessage("Durum güncellenirken bir hata oluştu.");
    } finally {
      setActionLoading(false);
      setDialogOpen(false);
    }
  };

  const openDialog = (action: ApplicationStatus) => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Yükleniyor...
      </div>
    );

  if (!jobPostData)
    return (
      <div className="flex items-center justify-center h-screen">
        İş ilanı bulunamadı.
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      <div className="overflow-y-hidden">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* İş Başlığı ve Durum */}
        <JobHeader
          jobTitle={jobPostData.title}
          companyName={jobPostData.companyName}
          status={jobStatus}
        />

        {/* Durum Güncelleme */}
        <Card className="mb-6 p-4">
          <h2 className="text-xl font-bold mb-4">Durum Güncelle</h2>
          <div className="flex space-x-4">
            <Button
              variant="default"
              className="bg-green-600 text-white"
              disabled={actionLoading || jobStatus === ApplicationStatus.Approved}
              onClick={() => openDialog(ApplicationStatus.Approved)}
            >
              Onayla
            </Button>
            <Button
              variant="default"
              className="bg-red-600 text-white"
              disabled={actionLoading || jobStatus === ApplicationStatus.Rejected}
              onClick={() => openDialog(ApplicationStatus.Rejected)}
            >
              Reddet
            </Button>
          </div>
        </Card>

        {/* İş Genel Bakış */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              İş Genel Bakış
            </CardTitle>
          </CardHeader>
          <CardContent>
            <JobOverview jobPost={jobPostData} />
          </CardContent>
        </Card>

        {/* İş Detayları */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">İş Detayları</CardTitle>
          </CardHeader>
          <CardContent>
            <JobDetails jobPost={jobPostData} />
          </CardContent>
        </Card>
      </div>

      {/* Durum Güncelleme Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === ApplicationStatus.Approved
                ? "İlanı onaylamak istiyor musunuz?"
                : "İlanı reddetmek istiyor musunuz?"}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              İptal
            </Button>
            <Button
              variant={
                dialogAction === ApplicationStatus.Approved
                  ? "default"
                  : "destructive"
              }
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

      {/* Sonuç Mesajı */}
      {resultMessage && (
        <div className="fixed bottom-4 right-4 p-4 bg-green-100 text-green-800 rounded-lg shadow">
          {resultMessage}
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
