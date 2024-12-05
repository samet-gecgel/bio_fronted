"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jobApplicationAPI } from "@/app/api";
import { IJobApplication } from "@/types/jobApplication";
import { formatDateNoHours } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import getIdFromToken from "@/utils/getIdFromToken";
import { CompanySidebar } from "@/components/custom/CompanyComponents/CompanySidebar";
import { StatusBadge } from "@/components/custom/SuperAdminComponents/StatusBadge";

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Kullanıcı giriş yapmamış.");
        return;
      }

      const companyId = getIdFromToken(token);
      const response = await jobApplicationAPI.getByCompanyId(companyId);
      setApplications(response.data);
      console.log("application", response.data);
      
    } catch (error) {
      console.error("Başvurular alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
        <div className="fixed hidden lg:block h-screen w-[240px]">
        <CompanySidebar />
      </div>
      <div className="flex-1 lg:ml-[240px] p-8 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6">Başvurular</h2>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">İş İlanı Başlığı</TableHead>
              <TableHead className="w-1/6">Başvuran Adı Soyadı</TableHead>
              <TableHead className="w-1/6">Başvuru Tarihi</TableHead>
              <TableHead className="w-1/6">Durum</TableHead>
              <TableHead className="text-right w-1/6">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length > 0 ? (
              applications.map((application: IJobApplication) => (
                <TableRow key={application.id}>
                  <TableCell>{application.jobPostTitle}</TableCell>
                  <TableCell>{application.applicantName}</TableCell>
                  <TableCell>
                    {formatDateNoHours(application.applicationDate)}
                  </TableCell>
                  <TableCell><StatusBadge status={application.status}/></TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/company/applicants/${application.id}`)}
                    >
                      Detay Gör
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Henüz bir başvuru yapılmamış.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      </div>
    </div>
  );
};

export default JobApplicationsPage;
