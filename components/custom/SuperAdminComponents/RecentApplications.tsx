import { IRecentApplication } from "@/types/dashboard"
import timeAgo from "@/utils/timeAgo"

export const RecentApplications = ({recentApplications} : {recentApplications : IRecentApplication[]}) => {
  return (
    <div className="space-y-8 ">
      {recentApplications.map((application : IRecentApplication) => (
        <div key={application.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{application.applicantName}</p>
            <p className="text-sm text-muted-foreground">
              {application.jobPostTitle} - {application.companyName}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {timeAgo(application.applicationDate)}
          </div>
        </div>
      ))}
    </div>
  )
}

