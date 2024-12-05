"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Banknote,
  Car,
  Users,
  Gift,
  Accessibility,
} from "lucide-react";
import { MainNav } from "@/components/ui/navigation-menu";
import Footer from "@/components/Footer";
import { formatDateNoHours } from "@/utils/formatDate";
import { IJobPost } from "@/types/jobpost";
import { jobPostAPI, resumeAPI, jobApplicationAPI } from "@/app/api";
import {
  formatEducationLevelsEnum,
  formatOffDaysEnum,
  jobTypeLabels,
} from "@/utils/enumTypeConvert";
import { Skeleton } from "@/components/ui/skeleton";
import { IResume } from "@/types/resume";
import getIdFromToken from "@/utils/getIdFromToken";

export default function JobDetailsPage() {
  const [job, setJob] = useState<IJobPost | null>(null);
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const params = useParams();
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, []);

  const fetchJobDetails = async () => {
    if (!jobId) {
      console.error("Job ID boş.");
      return;
    }

    try {
      const response = await jobPostAPI.getById(jobId);
      setJob(response.data);
    } catch (error) {
      console.error("İş ilanı alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserResumes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const userId = getIdFromToken(token);
      const response = await resumeAPI.getByUserId(userId);
      setResumes(response.data);
    } catch (error) {
      console.error("Özgeçmişler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchJobDetails();
    fetchUserResumes();
  }, [jobId]);

  const handleApply = async () => {
    if (!jobId || !selectedResumeId || !coverLetter) {
      setDialogMessage("Tüm alanları doldurun.");
      setDialogOpen(true);
      return;
    }

    setApplying(true);

    try {
      const jobApplicationData = {
        JobPostId: jobId,
        ResumeId: selectedResumeId,
        CoverLetter: coverLetter,
      };

      await jobApplicationAPI.create(jobApplicationData);
      setDialogMessage("Başvurunuz başarıyla gönderildi.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Başvuru sırasında hata oluştu:", error);
      setDialogMessage("Aynı ilana tekrardan başvuramazsınız.");
    } finally {
      setDialogOpen(true);
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNav />
        <div className="w-full space-y-6">
          <Skeleton className="h-8 w-3/4 rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-2/3 rounded-md" />
          <Skeleton className="h-10 w-1/3 rounded-md" />
          <div className="grid grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-md" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              {job?.title}
            </h1>
            <div className="prose max-w-none text-gray-700 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  İş Açıklaması
                </h2>
                <p>{job?.description}</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Yan Haklar
                </h2>
                <p>{job?.benefits || "Bilgi verilmedi."}</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  İzin Günleri
                </h2>
                <p>{formatOffDaysEnum(job.offDays)}</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Eğitim Bilgisi
                </h2>
                <p>{formatEducationLevelsEnum(job.requiredEducationLevel)}</p>
              </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={!hasToken}
                >
                  Başvur
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>İş Başvurusu: {job?.title}</DialogTitle>
                  <DialogDescription>
                    Lütfen özgeçmişinizi seçin ve bir ön yazı ekleyin.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                      Özgeçmiş Seçin
                    </label>
                    <Select
                      onValueChange={(value) => setSelectedResumeId(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Özgeçmiş seçin..." />
                      </SelectTrigger>
                      <SelectContent>
                        {resumes.map((resume) => (
                          <SelectItem key={resume.id} value={resume.id}>
                            {resume.resumeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">
                      Ön Yazı
                    </label>
                    <textarea
                      className="min-h-[150px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      placeholder="Kendinizi tanıtan bir ön yazı yazın..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      İptal
                    </Button>
                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleApply}
                      disabled={applying}
                    >
                      {applying ? "Başvuruluyor..." : "Başvur"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-800">
                İş Genel Bakış
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <OverviewItem
                  icon={<Calendar />}
                  label="İlan Tarihi"
                  value={formatDateNoHours(job!.publishedDate)}
                />
                <OverviewItem
                  icon={<Clock />}
                  label="Son Başvuru Tarihi"
                  value={formatDateNoHours(job!.applicationDeadline)}
                />
                <OverviewItem
                  icon={<Banknote />}
                  label="Maaş"
                  value={`${job?.minSalary} - ${job?.maxSalary} TL`}
                />
                <OverviewItem
                  icon={<MapPin />}
                  label="İlçe"
                  value={job.district}
                />
                <OverviewItem
                  icon={<Building2 />}
                  label="Çalışma Şekli"
                  value={jobTypeLabels[job.jobType]}
                />
                <OverviewItem
                  icon={<Gift />}
                  label="Deneyim"
                  value={`${job?.minExperienceYears} Yıl`}
                />
                <OverviewItem
                  icon={<Accessibility />}
                  label="Engelli Dostu"
                  value={job?.isDisabledFriendly ? "Evet" : "Hayır"}
                />
                <OverviewItem
                  icon={<Car />}
                  label="Ehliyet Durumu"
                  value={
                    job?.requiresDrivingLicense ? "Gerekli" : "Gerekli Değil"
                  }
                />
                <OverviewItem
                  icon={<Users />}
                  label="Yaş Aralığı"
                  value={`${job?.minAge || "-"} - ${job?.maxAge || "-"}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Dialog for success or error messages */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bilgilendirme</DialogTitle>
          </DialogHeader>
          <DialogDescription>{dialogMessage}</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OverviewItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-4 bg-gray-50 p-6 rounded-md text-center">
      <div className="mx-auto h-6 w-6 text-blue-500">{icon}</div>
      <div className="text-sm text-gray-500">{label}</div>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}
