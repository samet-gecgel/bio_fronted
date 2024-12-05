"use client";

import React from "react";
import { IResume } from "@/types/resume";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Languages, Award, Heart, User2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface ResumeDetailsModalProps {
  resume: IResume;
  onClose: () => void;
  isOpen: boolean;
}

export const ResumeDetailsModal: React.FC<ResumeDetailsModalProps> = ({
  resume,
  onClose,
  isOpen,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: tr });
  };

  console.log("resume sertifika", resume.certificate);
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        
        <div className="mt-6 space-y-8">
          {/* Özet */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Özet</h3>
            </div>
            <p className="text-muted-foreground ml-7">{resume.summary}</p>
          </div>

          {/* Eğitim */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Eğitim</h3>
            </div>
            <div className="ml-7 space-y-2">
              <Badge variant="secondary">{resume.requiredEducationLevel}</Badge>
              <p className="text-muted-foreground">{resume.education}</p>
            </div>
          </div>

          {/* Deneyim */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">İş Deneyimi</h3>
            </div>
            <p className="text-muted-foreground ml-7">{resume.experience}</p>
          </div>

          {/* Beceriler */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Beceriler</h3>
            </div>
            <div className="ml-7 flex flex-wrap gap-2">
              {resume.skills.split(',').map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill.trim()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Diller */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Languages className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Yabancı Diller</h3>
            </div>
            <div className="ml-7 flex flex-wrap gap-2">
              {resume.languages.split(',').map((language, index) => (
                <Badge key={index} variant="secondary">
                  {language.trim()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Hobiler */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Hobiler</h3>
            </div>
            <div className="ml-7 flex flex-wrap gap-2">
              {resume.hobbies.split(',').map((hobby, index) => (
                <Badge key={index} variant="outline">
                  {hobby.trim()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-4 border-t">
            <p>Oluşturulma: {formatDate(resume.createdAt)}</p>
            {resume.updatedAt && (
              <p>Son Güncelleme: {formatDate(resume.updatedAt)}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
