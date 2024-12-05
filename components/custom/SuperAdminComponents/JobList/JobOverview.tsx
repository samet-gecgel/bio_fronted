import React from "react";
import {
  Calendar,
  Clock,
  GraduationCap,
  Banknote,
  MapPin,
  Building2,
  Briefcase,
  Accessibility,
  Car,
  Users,
} from "lucide-react";
import { OverviewItem } from "@/components/custom/SuperAdminComponents/OverviewItem";
import { IJobPost } from "@/types/jobpost";
import { educationLevelLabels, jobTypeLabels } from "@/utils/enumTypeConvert";
import { formatDateNoHours } from "@/utils/formatDate";

interface JobOverviewProps {
  jobPost: IJobPost;
}

export const JobOverview: React.FC<JobOverviewProps> = ({ jobPost }) => {


  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      <OverviewItem
        icon={<Calendar className="w-5 h-5 text-blue-500" />}
        label="İlan Tarihi"
        value={formatDateNoHours(jobPost.publishedDate)}
      />
      <OverviewItem
        icon={<Clock className="w-5 h-5 text-blue-500" />}
        label="Son Başvuru Tarihi"
        value={formatDateNoHours(jobPost.applicationDeadline)}
      />
      <OverviewItem
        icon={<GraduationCap className="w-5 h-5 text-blue-500" />}
        label="Eğitim"
        value={educationLevelLabels[jobPost.requiredEducationLevel] || "Belirtilmedi"}
      />
      <OverviewItem
        icon={<Banknote className="w-5 h-5 text-blue-500" />}
        label="Maaş"
        value={
          jobPost.minSalary && jobPost.maxSalary
            ? `${jobPost.minSalary} - ${jobPost.maxSalary} TL`
            : "Belirtilmedi"
        }
      />
      <OverviewItem
        icon={<MapPin className="w-5 h-5 text-blue-500" />}
        label="İlçe"
        value={jobPost.district || "Belirtilmedi"}
      />
      <OverviewItem
        icon={<Building2 className="w-5 h-5 text-blue-500" />}
        label="Çalışma"
        value={jobTypeLabels[jobPost.jobType] || "Belirtilmedi"}
      />
      <OverviewItem
        icon={<Briefcase className="w-5 h-5 text-blue-500" />}
        label="Deneyim"
        value={
          jobPost.minExperienceYears
            ? `${jobPost.minExperienceYears} Yıl`
            : "Belirtilmedi"
        }
      />
      <OverviewItem
        icon={<Accessibility className="w-5 h-5 text-blue-500" />}
        label="Engelli Dostu Çalışma Ortamı"
        value={jobPost.isDisabledFriendly ? "Evet" : "Hayır"}
      />
      <OverviewItem
        icon={<Car className="w-5 h-5 text-blue-500" />}
        label="Ehliyet Durumu"
        value={jobPost.requiresDrivingLicense ? "Gerekli" : "Gerekli Değil"}
      />
      <OverviewItem
        icon={<Users className="w-5 h-5 text-blue-500" />}
        label="Yaş Aralığı"
        value={
          jobPost.minAge
            ? `${jobPost.minAge} - ${jobPost.maxAge || "Belirtilmedi"}`
            : "Belirtilmedi"
        }
      />
    </div>
  );
};
