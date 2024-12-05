"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import getIdFromToken from "@/utils/getIdFromToken";
import { jobPostAPI } from "@/app/api";
import {
  educationLevelLabels,
  jobTypeLabels,
  weekDayLabels,
} from "@/utils/enumTypeConvert";
import { BALIKESIR_DISTRICTS } from "@/utils/districts";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import DatePicker from "@/components/custom/DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CreateJobPostPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();
  const token = localStorage.getItem("token");
  const companyId: string = getIdFromToken(token);

  const [jobPost, setJobPost] = useState({
    title: "",
    description: "",
    minSalary: "",
    maxSalary: "",
    applicationDeadline: new Date(),
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
  
    if (!selectedDate || selectedDate <= new Date()) {
      setDialogMessage(
        "Başvuru son tarihi bugünden ileri bir tarih olmalıdır!"
      );
      setShowDialog(true);
      return;
    }
  
    try {
      setLoading(true);
      const payload = {
        ...jobPost,
        applicationDeadline: selectedDate.toISOString(),
        companyId,
        categoryId: "39D6E8D9-AFF4-4E8F-436C-08DD0B41BB23",
      };
      await jobPostAPI.create(payload);
      setDialogMessage("İş İlanı başarılı şekilde oluşturuldu!");
      setShowDialog(true);
    } catch (error) {
      console.error("Oluşturma sırasında hata oluştu:", error);
      setDialogMessage("İş İlanı oluşturulurken bir hata oluştu!");
      setShowDialog(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed hidden lg:block h-screen w-[240px]">
        <CompanySidebar />
      </div>
      <div className="flex-1 lg:ml-[240px] p-8 overflow-y-auto">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-2xl font-semibold text-center">
              İş İlanı Oluştur
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
                      {BALIKESIR_DISTRICTS.map((district: string) => (
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

              {/* Other Fields */}
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
                  <Label>Sürücü Belgesi Gerektiriyor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={jobPost.isDisabledFriendly}
                    onCheckedChange={(checked) =>
                      handleInputChange("isDisabledFriendly", checked)
                    }
                  />
                  <Label>Engelli Dostu</Label>
                </div>
              </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div>
                          <label
                            htmlFor="deadline"
                            className="block text-sm font-medium text-gray-700"
                          >
                            İş İlanı Son Başvuru Tarihi
                          </label>
                          <input
                            id="deadline"
                            type="text"
                            value={
                              selectedDate
                                ? selectedDate.toLocaleDateString("tr-TR")
                                : ""
                            }
                            placeholder="Tarih Seçiniz"
                            readOnly
                            className="bg-white border border-gray-300 text-gray-800 cursor-pointer rounded-md p-2 w-full"
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4 bg-gray-800 text-gray-300 border-gray-700">
                      <DatePicker
                          onDateSelect={(date) => setSelectedDate(date)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Yükleniyor..." : "Oluştur"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bilgilendirme</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                setShowDialog(false);
                if (
                  dialogMessage === "İş İlanı başarılı şekilde oluşturuldu!"
                ) {
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

export default CreateJobPostPage;
