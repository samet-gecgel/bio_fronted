"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";
import { MainNav } from "@/components/ui/navigation-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import getRoleFromToken from "@/utils/getRoleFromTokens";
import { resumeAPI } from "@/app/api";
import { EducationLevel } from "@/types/enums/educationLevel";
import { educationLevelLabels } from "@/utils/enumTypeConvert";

const UserResumeEditPage = () => {
  const [resumeData, setResumeData] = useState({
    resumeName: "",
    summary: "",
    education: "",
    experience: "",
    skills: "",
    languages: "",
    requiredEducationLevel: EducationLevel.None,
    hobbies: "",
  });

  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const router = useRouter();
  const params = useParams();
  const resumeId = params.id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/user/login");
      return;
    }

    const role = getRoleFromToken(token);
    if (role !== "JobSeeker") {
      router.push("/");
    }

    const fetchResume = async () => {
      try {
        const response = await resumeAPI.getById(resumeId);
        const resume = response.data;

        setResumeData({
          resumeName: resume.resumeName || "",
          summary: resume.summary || "",
          education: resume.education || "",
          experience: resume.experience || "",
          skills: resume.skills || "",
          languages: resume.languages || "",
          requiredEducationLevel: resume.requiredEducationLevel || EducationLevel.None,
          hobbies: resume.hobbies || "",
        });
      } catch (err) {
        router.push("/user/profile");
      }
    };

    fetchResume();
  }, [router, resumeId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      await resumeAPI.update(resumeId, {
        ResumeName: resumeData.resumeName,
        Summary: resumeData.summary,
        Education: resumeData.education,
        Experience: resumeData.experience,
        Skills: resumeData.skills,
        Languages: resumeData.languages,
        RequiredEducationLevel: resumeData.requiredEducationLevel,
        Hobbies: resumeData.hobbies,
      });

      setDialogMessage("Özgeçmiş başarıyla güncellendi.");
      setDialogOpen(true);
    } catch (err: any) {
      setDialogMessage(err.message || "Özgeçmiş güncellenirken bir hata oluştu.");
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEducationLevelChange = (level: EducationLevel) => {
    setResumeData((prev) => ({
      ...prev,
      requiredEducationLevel: prev.requiredEducationLevel ^ level,
    }));
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    router.push("/user/profile");
  };

  return (
    <div>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Özgeçmiş Düzenle
        </h2>
        <Card className="p-6 max-w-3xl mx-auto shadow-md">
          <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
              <Label htmlFor="resumeName">Özgeçmiş Adı</Label>
              <Input
                id="resumeName"
                name="resumeName"
                type="text"
                placeholder="Özgeçmiş adı giriniz"
                value={resumeData.resumeName}
                onChange={(e) => setResumeData({ ...resumeData, resumeName: e.target.value })}
                className="mt-2"
                required
              />
            </div>
            {/* Özet */}
            <div>
              <Label htmlFor="summary">Kısa Özgeçmiş</Label>
              <Input
                id="summary"
                name="summary"
                type="text"
                placeholder="Kendinizi tanıtın"
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            {/* Eğitim */}
            <div>
              <Label htmlFor="education">Eğitim</Label>
              <Input
                id="education"
                name="education"
                type="text"
                placeholder="Eğitim geçmişinizi yazın"
                value={resumeData.education}
                onChange={(e) => setResumeData({ ...resumeData, education: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            {/* Deneyim */}
            <div>
              <Label htmlFor="experience">Deneyim</Label>
              <Input
                id="experience"
                name="experience"
                type="text"
                placeholder="Deneyimlerinizi yazın"
                value={resumeData.experience}
                onChange={(e) => setResumeData({ ...resumeData, experience: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            {/* Yetenekler */}
            <div>
              <Label htmlFor="skills">Yetenekler</Label>
              <Input
                id="skills"
                name="skills"
                type="text"
                placeholder="Yeteneklerinizi yazın"
                value={resumeData.skills}
                onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            {/* Diller */}
            <div>
              <Label htmlFor="languages">Diller</Label>
              <Input
                id="languages"
                name="languages"
                type="text"
                placeholder="Bildiğiniz dilleri yazın"
                value={resumeData.languages}
                onChange={(e) => setResumeData({ ...resumeData, languages: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            {/* Eğitim Seviyesi */}
            <div>
              <Label>Eğitim Seviyesi</Label>
              <div className="mt-2 grid grid-cols-2 space-y-2">
                {Object.entries(educationLevelLabels).map(([level, label]) => (
                  <div key={level} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`education-level-${level}`}
                      checked={(resumeData.requiredEducationLevel & Number(level)) !== 0}
                      onChange={() => handleEducationLevelChange(Number(level))}
                      className="w-4 h-4"
                    />
                    <label htmlFor={`education-level-${level}`} className="text-sm">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Hobiler */}
            <div>
              <Label htmlFor="hobbies">Hobiler</Label>
              <Input
                id="hobbies"
                name="hobbies"
                type="text"
                placeholder="Hobilerinizi yazın"
                value={resumeData.hobbies}
                onChange={(e) => setResumeData({ ...resumeData, hobbies: e.target.value })}
                className="mt-2"
              />
            </div>

            {/* Gönder Butonu */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Yükleniyor..." : "Özgeçmiş Güncelle"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <Footer />

      {/* Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bilgilendirme</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleDialogClose}>Tamam</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserResumeEditPage;
