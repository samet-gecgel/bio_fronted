import React from "react";
import { IJobPost } from "@/types/jobpost";
import { formatWeekDaysEnum, weekDayLabels } from "@/utils/enumTypeConvert";

interface JobDetailsProps {
  jobPost: IJobPost;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ jobPost }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-semibold mb-2">İş Açıklaması</h3>
        <p className="text-gray-700">{jobPost.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-semibold mb-2">Faydalar</h3>
          <p className="text-gray-700">{jobPost.benefits}</p>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-2">Çalışma Günleri</h3>
          <p className="text-gray-700">İzin Günleri: {formatWeekDaysEnum(jobPost.offDays)}</p>
        </div>
      </div>
    </div>
  );
};
