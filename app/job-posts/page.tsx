"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { JobType } from "@/types/enums/jobType";
import { EducationLevel } from "@/types/enums/educationLevel";
import { IJobPost } from "@/types/jobpost";
import { MainNav } from "@/components/ui/navigation-menu";
import { PaginationCustom } from "@/components/custom/PaginationCustom";
import Footer from "@/components/Footer";
import jobPostAPI from "@/app/api/jobPostApi";
import { Badge } from "@/components/ui/badge";
import {
  educationLevelLabels,
  experienceLevelLabels,
  jobTypeLabels,
} from "@/utils/enumTypeConvert";
import { useRouter, useSearchParams } from "next/navigation";
import { IJobPostFilter } from "@/types/jobPostFilter";
import { BALIKESIR_DISTRICTS } from "@/utils/districts";
import { CheckedState } from "@radix-ui/react-checkbox";

export default function JobListingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<IJobPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(
    undefined
  );
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [selectedEducationLevels, setSelectedEducationLevels] = useState<
    EducationLevel[]
  >([]);
  const [selectedExperience, setSelectedExperience] = useState<
    number | undefined
  >(undefined);
  const [isDisabledOnly, setIsDisabledOnly] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch data from API based on filters
  const fetchJobs = async (filters: IJobPostFilter) => {
    try {
      setLoading(true);

      const response = await jobPostAPI.filter(filters);
      setJobs(response.data);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || response.data.length);
    } catch (error) {
      console.error("İş ilanları alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle URL parameters and fetch jobs on page load
  useEffect(() => {
    const district = searchParams.get("district");
    const search = searchParams.get("search");
    const jobTypes = searchParams.get("jobTypes");
    const educationLevels = searchParams.get("educationLevels");
    const experience = searchParams.get("experience");
    const disabled = searchParams.get("disabled");

    const filters: IJobPostFilter = {
      title: search || undefined,
      districts: district ? [district] : undefined,
      jobTypes: jobTypes
        ? jobTypes.split(",").map(Number).reduce((acc, val) => acc | val, 0)
        : undefined,
      requiredEducationLevel: educationLevels
        ? educationLevels
            .split(",")
            .map(Number)
            .reduce((acc, val) => acc | val, 0)
        : undefined,
      experienceLevel: experience ? Number(experience) : undefined,
      isDisabledFriendly: disabled === "true" ? true : undefined,
    };

    setSearchTerm(search || "");
    setSelectedDistrict(district || undefined);
    setSelectedJobTypes(jobTypes ? jobTypes.split(",").map(Number) : []);
    setSelectedEducationLevels(
      educationLevels ? educationLevels.split(",").map(Number) : []
    );
    setSelectedExperience(experience ? Number(experience) : undefined);
    setIsDisabledOnly(disabled === "true");

    fetchJobs(filters);
  }, [searchParams]);

  const updateURLParams = () => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (selectedDistrict) params.set("district", selectedDistrict);
    if (selectedJobTypes.length)
      params.set("jobTypes", selectedJobTypes.join(","));
    if (selectedEducationLevels.length)
      params.set("educationLevels", selectedEducationLevels.join(","));
    if (selectedExperience !== undefined)
      params.set("experience", selectedExperience.toString());
    if (isDisabledOnly) params.set("disabled", "true");

    router.push(`?${params.toString()}`);
  };

  const applyFilters = () => {
    updateURLParams();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDistrict(undefined);
    setSelectedJobTypes([]);
    setSelectedEducationLevels([]);
    setSelectedExperience(undefined);
    setIsDisabledOnly(false);
    setCurrentPage(1);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-12 gap-6">
          {/* Filtreleme Alanı */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-lg border p-6 space-y-8">
              <Input
                type="search"
                placeholder="İş Ara..."
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applyFilters();
                  }
                }}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">İlçe</label>
                <Select
                  key={selectedDistrict || "default"}
                  value={selectedDistrict}
                  onValueChange={(value) => setSelectedDistrict(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="İlçe Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {BALIKESIR_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Çalışma Şekli</label>
                <div className="space-y-2">
                  {Object.entries(jobTypeLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedJobTypes.includes(Number(key))}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedJobTypes([
                              ...selectedJobTypes,
                              Number(key),
                            ]);
                          } else {
                            setSelectedJobTypes(
                              selectedJobTypes.filter(
                                (type) => type !== Number(key)
                              )
                            );
                          }
                        }}
                      />
                      <label>{label}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tecrübe</label>
                <Select
                  key={selectedExperience || "default"}
                  value={selectedExperience?.toString()}
                  onValueChange={(value) => setSelectedExperience(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tecrübe Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(experienceLevelLabels).map(
                      ([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Eğitim Seviyesi</label>
                <div className="space-y-2">
                  {Object.entries(educationLevelLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedEducationLevels.includes(Number(key))}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEducationLevels([
                              ...selectedEducationLevels,
                              Number(key),
                            ]);
                          } else {
                            setSelectedEducationLevels(
                              selectedEducationLevels.filter(
                                (level) => level !== Number(key)
                              )
                            );
                          }
                        }}
                      />
                      <label>{label}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="disabled"
                  checked={isDisabledOnly}
                  onCheckedChange={(checked: CheckedState) => setIsDisabledOnly(!!checked)}
                />
                <label htmlFor="disabled" className="text-sm">
                  Sadece engelli ilanlarını göster
                </label>
              </div>
              <Button
                className="w-full bg-black text-white"
                onClick={applyFilters}
              >
                Filtrele
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={resetFilters}
              >
                Filtreyi Sıfırla
              </Button>
            </div>
          </div>

          {/* İş İlanları Alanı */}
          <div className="lg:col-span-9">
            <div className="mb-4 text-sm text-gray-600">
              {loading
                ? "Yükleniyor..."
                : `Toplam ${totalItems} iş ilanı bulundu.`}
            </div>
            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="relative cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/job-posts/${job.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>{job.district}</div>
                          <div>{job.companyName || "Şirket bilgisi yok"}</div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <Badge variant="outline">
                            {job.categoryName || "Kategori Yok"}
                          </Badge>
                          <Badge variant="secondary">
                            {jobTypeLabels[job.jobType]}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(job.publishedDate).toLocaleDateString(
                            "tr-TR"
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <div className="absolute top-4 right-4">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <PaginationCustom
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
