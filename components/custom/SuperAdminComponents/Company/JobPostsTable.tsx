import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { StatusBadge } from "../StatusBadge";
import { IJobPost } from "@/types/jobpost";

interface JobPostsTableProps {
  jobPosts?: IJobPost[];
}

export const JobPostsTable: React.FC<JobPostsTableProps> = ({ jobPosts = [] }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/5">Başlık</TableHead>
            <TableHead className="w-1/5">Yayın Tarihi</TableHead>
            <TableHead className="w-1/5">Durumu</TableHead>
            <TableHead className="w-1/5">Aksiyonlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobPosts && jobPosts.length > 0 ? (
            jobPosts.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>
                  {new Date(job.publishedDate).toLocaleDateString("tr-TR")}
                </TableCell>
                <TableCell>
                  <StatusBadge status={job.applicationStatus} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary"
                    asChild
                  >
                    <a href={`/super-admin/job-posts/${job.id}`}>
                      İlana Git
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                Henüz iş ilanı bulunmamaktadır.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
