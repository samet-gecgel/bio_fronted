"use client";

import React, { useEffect, useState } from "react";
import { SuperAdminSidebar } from "@/components/custom/SuperAdminComponents/SuperAdminSidebar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IUser } from "@/types/user";
import { UserHeader } from "@/components/custom/SuperAdminComponents/User/UserHeader";
import { UserInfo } from "@/components/custom/SuperAdminComponents/User/UserInfo";
import { ResumesTable } from "@/components/custom/SuperAdminComponents/User/ResumesTable";
import { JobApplicationsTable } from "@/components/custom/SuperAdminComponents/User/JobApplicationsTable";
import { ApplicationStatus } from "@/types/enums/applicationStatus";
import { userAPI } from "@/app/api";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { IResume } from "@/types/resume";
import { ResumeDetailsModal } from "@/components/custom/SuperAdminComponents/User/ResumeDetails";

const UserDetailPage: React.FC = () => {
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<ApplicationStatus | null>(
    null
  );
  const [resultMessage, setResultMessage] = useState<string>("");
  const [selectedResume, setSelectedResume] = useState<IResume | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

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

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await userAPI.getById(userId);
        setUserData(response.data);
        console.log("user id", userId);
      } catch (error) {
        console.error("Kullanıcı verisi alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleActionConfirm = async () => {
    if (!dialogAction) return;

    setActionLoading(true);
    try {
      if (dialogAction === ApplicationStatus.Approved) {
        await userAPI.approve(userId);
        setUserData({ ...userData!, approvalStatus: ApplicationStatus.Approved });
        setResultMessage("Kullanıcı başarıyla onaylandı!");
      } else if (dialogAction === ApplicationStatus.Rejected) {
        await userAPI.reject(userId);
        setUserData({ ...userData!, approvalStatus: ApplicationStatus.Rejected });
        setResultMessage("Kullanıcı başarıyla reddedildi!");
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

  if (loading || !userData) {
    return (
      <div className="container mx-auto space-y-4 p-4 lg:space-y-6 lg:p-8">
        <Card>
          <div className="p-6">
            <Skeleton className="h-20 w-full" />
          </div>
        </Card>
        <Card>
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
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="overflow-y-hidden">
        <SuperAdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* User Header */}
        <Card className="mb-6">
          <UserHeader user={userData} />
        </Card>

        {/* User Info */}
        <Card className="mb-6">
          <UserInfo user={userData} />
        </Card>

        {/* Durum Güncelleme */}
        <Card className="mb-6 p-4">
          <h2 className="text-xl font-bold mb-4">Durum Güncelle</h2>
          <div className="flex space-x-4">
            <Button
              variant="default"
              className="bg-green-600 text-white"
              disabled={actionLoading || userData.approvalStatus === ApplicationStatus.Approved}
              onClick={() => openDialog(ApplicationStatus.Approved)}
            >
              Onayla
            </Button>
            <Button
              variant="default"
              className="bg-red-600 text-white"
              disabled={actionLoading || userData.approvalStatus === ApplicationStatus.Rejected}
              onClick={() => openDialog(ApplicationStatus.Rejected)}
            >
              Reddet
            </Button>
          </div>
        </Card>

        {/* Resumes Table */}
        <div className="py-4 px-2 text-xl font-medium">Özgeçmişler</div>
        <Card className="mb-6">
        <ResumesTable userId={userData.id} />
        </Card>

        {/* Job Applications Table */}
        <div className="py-4 px-2 text-xl font-medium">İş Başvuruları</div>
        <Card>
          <JobApplicationsTable jobApplications={userData.jobApplications} />
        </Card>
      </div>

      {/* Resume Details Modal */}
      {selectedResume && (
        <ResumeDetailsModal
          resume={selectedResume}
          onClose={() => setResumeModalOpen(false)}
          isOpen={resumeModalOpen}
        />
      )}

      {/* Onay ve Reddetme Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === ApplicationStatus.Approved
                ? "Kullanıcıyı onaylamak istiyor musunuz?"
                : "Kullanıcıyı reddetmek istiyor musunuz?"}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              İptal
            </Button>
            <Button
              variant={
                dialogAction === ApplicationStatus.Approved ? "default" : "destructive"
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

export default UserDetailPage;
