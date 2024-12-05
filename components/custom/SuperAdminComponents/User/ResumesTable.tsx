import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IResume } from "@/types/resume";
import { resumeAPI } from "@/app/api";
import { ResumeDetailsModal } from "./ResumeDetails";

interface ResumesTableProps {
  userId: string;
}

export const ResumesTable: React.FC<ResumesTableProps> = ({ userId }) => {
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [selectedResume, setSelectedResume] = useState<IResume | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const fetchedResumes = await resumeAPI.getByUserId(userId);
      const resumeData = fetchedResumes.data;
      console.log("resume", resumeData);
      
      setResumes(resumeData);
    } catch (error) {
      console.error("Özgeçmişler alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [userId]);

  const handleViewDetails = (resume: IResume) => {
    setSelectedResume(resume);
  };

  const closeModal = () => {
    setSelectedResume(null);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Başlık</TableHead>
            <TableHead className="w-1/4">Oluşturulma Tarihi</TableHead>
            <TableHead className="w-1/4 text-right">Detay Gör</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.map((resume) => (
            <TableRow key={resume.id}>
              <TableCell>{resume.summary}</TableCell>
              <TableCell>
                {new Date(resume.createdAt).toLocaleDateString("tr-TR")}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" onClick={() => handleViewDetails(resume)}>
                  Detay Gör
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal Bileşeni */}
      {selectedResume && (
        <ResumeDetailsModal
          resume={selectedResume}
          onClose={closeModal}
          isOpen={true}
        />
      )}
    </div>
  );
};
