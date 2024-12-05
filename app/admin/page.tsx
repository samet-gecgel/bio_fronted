"use client";

import {
  Building2,
  Users,
  Briefcase,
  Building,
  UserCheck,
  ScrollText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/custom/SuperAdminComponents/JobApplicationsChart";
import { RecentApplications } from "@/components/custom/SuperAdminComponents/RecentApplications";
import { TopCompanies } from "@/components/custom/SuperAdminComponents/TopCompanies";
import { useRouter } from "next/navigation";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import { useEffect, useState } from "react";
import dashBoardAPI from "@/app/api/dashboardApi";
import {
  IPlatformStatistics,
  IUserStatistics,
  ICompanyStatistics,
  IJobPostStatistics,
  IApplicationStatistics,
} from "@/types/dashboard";
import { AdminSidebar } from "@/components/custom/SuperAdminComponents/AdminSidebar";

export default function DashboardPage() {
  const router = useRouter();
  const [userStatistics, setUserStatistics] = useState<IUserStatistics | null>(
    null
  );
  const [companyStatistics, setCompanyStatistics] =
    useState<ICompanyStatistics | null>(null);
  const [jobPostStatistics, setJobPostStatistics] =
    useState<IJobPostStatistics | null>(null);
  const [applicationStatistics, setApplicationStatistics] =
    useState<IApplicationStatistics | null>(null);
  const [platformStatistics, setPlatformStatistics] =
    useState<IPlatformStatistics | null>(null);
  const [last7JobApplicationData, setLast7JobApplicationData] 
  = useState<Array<{ name: string; total: number}>>([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem("token");


  useEffect(() => {

    if (!token) {
      router.push("/admin/login");
      return ;
    }
  
    const role = getRoleFromToken(token);
    if (role !== "Admin") {
      router.push("/");
      return ;
    }
    const fetchStatistics = async () => {
      try {
        setLoading(true);

        const [
          userStats,
          companyStats,
          jobPostStats,
          applicationStats,
          platformStats,
          last7JobApplicationData
        ] = await Promise.all([
          dashBoardAPI.getUserStatistics(),
          dashBoardAPI.getCompanyStatistics(),
          dashBoardAPI.getJobpostStatistics(),
          dashBoardAPI.getApplicationStatistics(),
          dashBoardAPI.getPlatformStatistics(),
          dashBoardAPI.getJobApplicationsLast7Days(),
        ]);

        setUserStatistics(userStats.data);
        setCompanyStatistics(companyStats.data);
        setJobPostStatistics(jobPostStats.data);
        setApplicationStatistics(applicationStats.data);
        setPlatformStatistics(platformStats.data);
        setLast7JobApplicationData(last7JobApplicationData.data);
      } catch (error) {
        console.error("İstatistik verileri yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (
    !userStatistics ||
    !companyStatistics ||
    !jobPostStatistics ||
    !applicationStatistics ||
    !platformStatistics
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Veriler alınamadı.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Toplam Kullanıcılar
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStatistics.totalUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Toplam Şirketler
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {companyStatistics.totalCompanies}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aktif İş İlanları
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobPostStatistics.activeJobPosts}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>İş İlanı Başvuruları</CardTitle>
              <CardDescription>
                Son 7 günlük başvuru istatistikleri
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview  data={last7JobApplicationData}/>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Son Başvurular</CardTitle>
              <CardDescription>Son 5 iş başvurusu</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentApplications
                recentApplications={applicationStatistics.recentApplications}
              />
            </CardContent>
          </Card>
        </div>

        {/* Top Companies and Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
            <CardTitle>En Çok Başvuru Alan Firmalar</CardTitle>
            <CardDescription>Toplam başvuru sayısına göre sıralanmıştır</CardDescription>
            </CardHeader>
            <CardContent>
              <TopCompanies
                data={applicationStatistics.mostAppliedCompanies}
              />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Platform İstatistikleri</CardTitle>
              <CardDescription>Genel platform metrikleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Onaylı Kullanıcılar
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userStatistics.approvedUsers} kullanıcı
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Kayıtlı Firmalar
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {companyStatistics.totalCompanies} firma
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ScrollText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Toplam İş İlanı
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {jobPostStatistics.totalJobPosts} ilan
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
