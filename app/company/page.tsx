"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CompanySidebar } from "@/components/custom/CompanyComponents/CompanySidebar";
import { useEffect, useState } from "react";
import { IDashboardCompany } from "@/types/dashboard";
import { useRouter } from "next/navigation";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import dashBoardAPI from "../api/dashboardApi";

export default function CompanyDashboard() {
  const [dashboardData, setDashboardData] = useState<IDashboardCompany | null>(
    null
  );
  const [loading, setLoading] = useState(true);
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

    const fetchData = async () => {
      try {
        const response = await dashBoardAPI.getCompanyDashboardStatistics();
        setDashboardData(response.data);
        console.log("data", response.data);
      } catch (error) {
        console.error("Şirket istatistikleri yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Veriler alınamadı. Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <CompanySidebar />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Şirket Dashboard</h1>

        {/* Top Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam İş İlanları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalJobPosts || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif İş İlanları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.activeJobPosts || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Başvurular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalApplications || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam İlan Görüntülenmeleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalJobPostViews || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Last 7 Days Applications */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Son 7 Gün Başvuru İstatistikleri</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {dashboardData.jobApplicationsLast7Days.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dashboardData.jobApplicationsLast7Days}>
                    <XAxis
                      dataKey="key"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>Son 7 gün içerisinde başvuru bulunmamaktadır.</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Son Başvurular</CardTitle>
              <CardDescription>En son yapılan iş başvuruları</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.recentApplications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>İş İlanı</TableHead>
                      <TableHead>Başvuran</TableHead>
                      <TableHead>Tarih</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.recentApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {application.jobPostTitle}
                        </TableCell>
                        <TableCell>{application.applicantName}</TableCell>
                        <TableCell>
                          {new Date(application.applicationDate).toLocaleDateString(
                            "tr-TR"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>Son başvuru bulunmamaktadır.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Job Posts */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Aktif İş İlanları</CardTitle>
            <CardDescription>Şu anda yayında olan iş ilanlarınız</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.activeJobPostsTable.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İlan Başlığı</TableHead>
                    <TableHead>Yayın Tarihi</TableHead>
                    <TableHead>Son Başvuru Tarihi</TableHead>
                    <TableHead>Maaş Aralığı</TableHead>
                    <TableHead>Görüntülenme</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.activeJobPostsTable.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>
                        {new Date(job.publishedDate).toLocaleDateString("tr-TR")}
                      </TableCell>
                      <TableCell>
                        {new Date(job.applicationDeadline).toLocaleDateString("tr-TR")}
                      </TableCell>
                      <TableCell>
                        {job.minSalary} - {job.maxSalary} TL
                      </TableCell>
                      <TableCell>{job.viewCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>Aktif iş ilanı bulunmamaktadır.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
