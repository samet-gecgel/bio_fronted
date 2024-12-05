"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CompanySidebar } from "@/components/custom/CompanyComponents/CompanySidebar";
import { jobPostAPI } from "@/app/api";
import {
  educationLevelLabels,
  jobTypeLabels,
  weekDayLabels,
  experienceLevelLabels,
} from "@/utils/enumTypeConvert";
import { BALIKESIR_DISTRICTS } from "@/utils/districts";
import getIdFromToken from "@/utils/getIdFromToken";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const EditJobPostPage: React.FC = () => {
  
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const token = localStorage.getItem("token");
  const companyId : string = getIdFromToken(token);

  const [jobPost, setJobPost] = useState({
    title: "",
    description: "",
    minSalary: "",
    maxSalary: "",
    applicationDeadline: "",
    district: "",
    benefits: "",
    offDays: 0,
    requiredEducationLevel: 0,
    isDisabledFriendly: false,
    jobType: 0,
    minExperienceYears: 0,
    experienceLevel: 0,
    requiresDrivingLicense: false,
    minAge: "",
    maxAge: "",
  });
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        setLoading(true);
        const response = await jobPostAPI.getById(jobId);
        const data = response.data;

        setJobPost({
          title: data.title || "",
          description: data.description || "",
          minSalary: data.minSalary?.toString() || "",
          maxSalary: data.maxSalary?.toString() || "",
          applicationDeadline: data.applicationDeadline || "",
          district: data.district || "",
          benefits: data.benefits || "",
          offDays: data.offDays || 0,
          requiredEducationLevel: data.requiredEducationLevel || 0,
          isDisabledFriendly: data.isDisabledFriendly || false,
          jobType: data.jobType || 0,
          minExperienceYears: data.minExperienceYears || 0,
          experienceLevel: data.experienceLevel || 0,
          requiresDrivingLicense: data.requiresDrivingLicense || false,
          minAge: data.minAge || "",
          maxAge: data.maxAge || "",
        });
      } catch (error) {
        console.error("Veriler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPost();
  }, [jobId]);

  const handleInputChange = (
    field: keyof typeof jobPost,
    value: string | boolean | number
  ) => {
    setJobPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof typeof jobPost, value: number) => {
    setJobPost((prev) => ({
      ...prev,
      [field]: prev[field] ^ value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);      
      const payload = {
        ...jobPost,
        companyId, 
        categoryId: "39D6E8D9-AFF4-4E8F-436C-08DD0B41BB23"
      };
      await jobPostAPI.update(jobId, payload);
      setDialogMessage("İş İlanı başarılı şekilde güncellendi!");
      setShowDialog(true);
    } catch (error) {
      console.error("Güncelleme sırasında hata oluştu:", error);
      setDialogMessage("Güncelleme sırasında bir hata oluştu!");
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed hidden lg:block h-screen w-[240px]">
        <CompanySidebar />
      </div>
      <div className="flex-1 lg:ml-[240px] p-8 overflow-y-auto">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-2xl font-semibold text-center">
              İş İlanı Düzenle
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title and Description */}
              <div className="space-y-4">
                <Label htmlFor="title">İlan Başlığı</Label>
                <Input
                  id="title"
                  value={jobPost.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
                <Label htmlFor="description">İlan Açıklaması</Label>
                <Textarea
                  id="description"
                  value={jobPost.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  required
                />
              </div>

              {/* Salary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minSalary">Minimum Maaş</Label>
                  <Input
                    id="minSalary"
                    type="number"
                    value={jobPost.minSalary}
                    onChange={(e) =>
                      handleInputChange("minSalary", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxSalary">Maksimum Maaş</Label>
                  <Input
                    id="maxSalary"
                    type="number"
                    value={jobPost.maxSalary}
                    onChange={(e) =>
                      handleInputChange("maxSalary", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* District and Benefits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>İlçe</Label>
                  <Select
                    value={jobPost.district}
                    onValueChange={(value) =>
                      handleInputChange("district", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Bir ilçe seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {BALIKESIR_DISTRICTS.map((district : string) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Faydalar</Label>
                  <Input
                    value={jobPost.benefits}
                    onChange={(e) =>
                      handleInputChange("benefits", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div>
                <Label>İzin Günleri</Label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(weekDayLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`offDay-${key}`}
                        checked={(jobPost.offDays & Number(key)) !== 0}
                        onCheckedChange={() =>
                          handleCheckboxChange("offDays", Number(key))
                        }
                      />
                      <Label htmlFor={`offDay-${key}`}>{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Eğitim Seviyeleri</Label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(educationLevelLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`educationLevel-${key}`}
                        checked={
                          (jobPost.requiredEducationLevel & Number(key)) !== 0
                        }
                        onCheckedChange={() =>
                          handleCheckboxChange(
                            "requiredEducationLevel",
                            Number(key)
                          )
                        }
                      />
                      <Label htmlFor={`educationLevel-${key}`}>{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div>
                <Label>Çalışma Şekli</Label>
                <Select
                  value={String(jobPost.jobType)}
                  onValueChange={(value) =>
                    handleInputChange("jobType", Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Çalışma şeklini seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(jobTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Minimum Deneyim Yılı</Label>
                  <Input
                    type="number"
                    value={jobPost.minExperienceYears.toString()}
                    onChange={(e) =>
                      handleInputChange(
                        "minExperienceYears",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Tecrübe Durumu</Label>
                  <Select
                    value={String(jobPost.experienceLevel)}
                    onValueChange={(value) =>
                      handleInputChange("experienceLevel", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tecrübe durumu seçin" />
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
              </div>

              {/* Other */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Minimum Yaş</Label>
                  <Input
                    type="number"
                    value={jobPost.minAge}
                    onChange={(e) =>
                      handleInputChange("minAge", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Maksimum Yaş</Label>
                  <Input
                    type="number"
                    value={jobPost.maxAge}
                    onChange={(e) =>
                      handleInputChange("maxAge", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={jobPost.requiresDrivingLicense}
                    onCheckedChange={(checked) =>
                      handleInputChange("requiresDrivingLicense", checked)
                    }
                  />
                  <Label>Sürücü Belgesi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={jobPost.isDisabledFriendly}
                    onCheckedChange={(checked) =>
                      handleInputChange("isDisabledFriendly", checked)
                    }
                  />
                  <Label>Engelli Çalışanlar İçin</Label>
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Güncelleniyor..." : "Güncelle"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bilgilendirme</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="default"
              onClick={() => {
                setShowDialog(false);
                if (dialogMessage === "İş İlanı başarılı şekilde güncellendi!") {
                  router.push("/company/job-post");
                }
              }}
            >
              Tamam
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditJobPostPage;
