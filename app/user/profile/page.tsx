"use client";

import Footer from "@/components/Footer";
import { MainNav } from "@/components/ui/navigation-menu";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import getIdFromToken from "@/utils/getIdFromToken";
import {
  certificateAPI,
  jobApplicationAPI,
  resumeAPI,
  userAPI,
} from "@/app/api";
import { IResume } from "@/types/resume";
import { ICertificate } from "@/types/certificate";
import { formatDateNoHours } from "@/utils/formatDate";
import { IJobApplication } from "@/types/jobApplication";
import { StatusBadge } from "@/components/custom/SuperAdminComponents/StatusBadge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const UserProfilePage = () => {
  const router = useRouter();
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id: string;
  } | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = token ? getRoleFromToken(token) : null;
      const userId = token ? getIdFromToken(token) : null;

      if (!token || role !== "JobSeeker") {
        router.push("/");
        return;
      }

      const response = await userAPI.getById(userId);
      console.log("User Data: ", response.data);

      try {
        const resumesResponse = await resumeAPI.getByUserId(userId);
        setResumes(resumesResponse.data);
      } catch (error) {
        console.error("Özgeçmiş bilgileri alınamadı: ", error);
        setResumes([]);
      }

      try {
        const certificatesResponse = await certificateAPI.getUserCertificates();
        setCertificates(certificatesResponse.data);
      } catch (error) {
        console.error("Sertifika bilgileri alınamadı: ", error);
        setCertificates([]);
      }

      try {
        const jobApplicationResponse = await jobApplicationAPI.getByUserId();
        setApplications(jobApplicationResponse.data);
      } catch (error) {
        console.error("İş başvuruları alınamadı: ", error);
        setApplications([]);
      }
    } catch (error) {
      console.error("Hata: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "resume") {
        await resumeAPI.delete(deleteTarget.id);
        setResumes((prev) =>
          prev.filter((resume) => resume.id !== deleteTarget.id)
        );
      } else if (deleteTarget.type === "certificate") {
        await certificateAPI.delete(deleteTarget.id);
        setCertificates((prev) =>
          prev.filter((certificate) => certificate.id !== deleteTarget.id)
        );
      }
    } catch (error) {
      console.error("Silme hatası: ", error);
    } finally {
      setDeleteTarget(null); // Dialog'u kapat
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        {/* Özgeçmişlerim */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Özgeçmişlerim</h2>
          <Button onClick={() => router.push("/user/resume/add")}>
            Özgeçmiş Oluştur
          </Button>
        </div>
        <Card className="mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Özgeçmiş Adı</TableHead>
                <TableHead className="w-1/3">Oluşturulma Tarihi</TableHead>
                <TableHead className="text-right">Aksiyonlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumes.length > 0 ? (
                resumes.map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell>{resume.resumeName}</TableCell>
                    <TableCell>{formatDateNoHours(resume.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/user/resume/edit/${resume.id}`)
                          }
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDeleteTarget({ type: "resume", id: resume.id })
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Henüz bir özgeçmiş eklemediniz.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Sertifikalarım */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Sertifikalarım</h2>
          <Button onClick={() => router.push("/user/certificate/add")}>
            Sertifika Oluştur
          </Button>
        </div>
        <Card className="mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Sertifika Adı</TableHead>
                <TableHead className="w-1/3">Sertifika Alınma Tarihi</TableHead>
                <TableHead className="text-right">Aksiyonlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.length > 0 ? (
                certificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>{certificate.certificateName}</TableCell>
                    <TableCell>
                      {formatDateNoHours(certificate.issueDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDeleteTarget({
                              type: "certificate",
                              id: certificate.id,
                            })
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Henüz bir sertifika eklemediniz.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* İş Başvurularım */}
        <h2 className="text-xl font-semibold mb-6">İş Başvurularım</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">İş Başlığı</TableHead>
                <TableHead className="w-1/3">Şirket</TableHead>
                <TableHead className="w-1/6">Başvuru Tarihi</TableHead>
                <TableHead className="w-1/6 text-right">Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>{application.jobPostTitle}</TableCell>
                    <TableCell>{application.companyName}</TableCell>
                    <TableCell>
                      {formatDateNoHours(application.applicationDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={application.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Henüz bir iş başvurusunda bulunmadınız.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
      <Footer />

      {/* Silme Onay Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Silme İşlemi</AlertDialogTitle>
            <AlertDialogDescription>
              Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Vazgeç
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Sil
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserProfilePage;
