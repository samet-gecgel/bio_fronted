"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import jobPostAPI from "@/app/api/jobPostApi";
import { IJobPost } from "@/types/jobpost";
import { jobTypeLabels } from "@/utils/enumTypeConvert";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const JobListings = () => {
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [jobs, setJobs] = useState<IJobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the latest job posts
        const response = await jobPostAPI.getLatest(4);
        const latestJobs = response.data;
        setJobs(latestJobs);

        // Create category data dynamically based on job posts
        const categoryCounts = latestJobs.reduce((acc, job) => {
          if (!acc[job.categoryName]) {
            acc[job.categoryName] = 0;
          }
          acc[job.categoryName]++;
          return acc;
        }, {} as Record<string, number>);

        // Transform to array for rendering
        const categoryArray = Object.keys(categoryCounts).map((key) => ({
          name: key,
          count: categoryCounts[key],
        }));

        setCategories(categoryArray);
      } catch (error) {
        console.error("Veriler alınırken bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 px-4 md:px-16 py-8">
      {/* Sol Taraf - Kategoriler */}
      <div className="w-full md:w-1/4">
        <h2 className="text-xl font-semibold mb-4">Kategoriler</h2>
        <div className="flex flex-col gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg"
                >
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-10" />
                </div>
              ))
            : categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
              ))}
        </div>
      </div>

      {/* Sağ Taraf - İş İlanları */}
      <div className="w-full md:w-3/4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            En <span className="text-blue-600">Güncel</span> İş İlanları
          </h2>
          <Button
            variant="link"
            className="text-blue-600 flex items-center"
            onClick={() => router.push("/JobPosts")}
          >
            Tümünü Gör <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm"
                >
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))
            : jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => router.push(`/JobPosts/${job.id}`)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <ChevronRight />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{job.district}</p>
                  <p className="text-sm text-gray-500">{job.companyName}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="outline">{job.categoryName}</Badge>
                    <Badge variant="secondary">{jobTypeLabels[job.jobType]}</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(job.publishedDate).toLocaleDateString("tr-TR")}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default JobListings;
