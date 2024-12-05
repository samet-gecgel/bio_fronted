"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { IJobApplicationDetail } from "@/types/jobApplicationDetail"
import { IResume } from "@/types/resume"
import { jobApplicationAPI, resumeAPI } from "@/app/api"
import { formatDateNoHours } from "@/utils/formatDate"
import { CompanySidebar } from "@/components/custom/CompanyComponents/CompanySidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, FileText, Briefcase, GraduationCap, Languages, Award } from 'lucide-react'
import { StatusBadge } from "@/components/custom/SuperAdminComponents/StatusBadge"
import { ApplicationStatus } from "@/types/enums/applicationStatus"

const ApplicantDetails = () => {
  const [applicationDetails, setApplicationDetails] = useState<IJobApplicationDetail | null>(null)
  const [resumeDetails, setResumeDetails] = useState<IResume | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null)
  const params = useParams()
  const router = useRouter()

  const applicationId = params.id as string

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await jobApplicationAPI.getApplicationDetail(applicationId)
        setApplicationDetails(response.data)

        if (response.data.resumeId) {
          const resumeResponse = await resumeAPI.getById(response.data.resumeId)
          setResumeDetails(resumeResponse.data)
        }
      } catch (error) {
        console.error("Başvuru detayları alınamadı:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplicationDetails()
  }, [applicationId])

  const handleConfirmAction = async () => {
    setStatusUpdating(true)
    try {
      if (confirmAction === "approve") {
        await jobApplicationAPI.approve(applicationId)
        setSuccessMessage("Başvuru onaylandı.")
      } else if (confirmAction === "reject") {
        await jobApplicationAPI.reject(applicationId)
        setSuccessMessage("Başvuru reddedildi.")
      }
      setDialogOpen(true)
      setConfirmDialogOpen(false)
      const updatedDetails = await jobApplicationAPI.getApplicationDetail(applicationId)
      setApplicationDetails(updatedDetails.data)
    } catch (error) {
      console.error("İşlem başarısız:", error)
    } finally {
      setStatusUpdating(false)
      setConfirmAction(null)
    }
  }

  const openConfirmDialog = (action: "approve" | "reject") => {
    setConfirmAction(action)
    setConfirmDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="fixed hidden lg:block h-screen w-[240px]">
          <CompanySidebar />
        </div>
        <div className="flex-1 lg:ml-[240px] p-4 md:p-8 overflow-y-auto">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-24 w-full mb-6" />
          <Skeleton className="h-10 w-1/3 mb-4" />
        </div>
      </div>
    )
  }

  const isApplicationProcessed = applicationDetails?.status === ApplicationStatus.Approved || applicationDetails?.status === ApplicationStatus.Rejected;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed hidden lg:block h-screen w-[240px]">
        <CompanySidebar />
      </div>
      <div className="flex-1 lg:ml-[240px] p-4 md:p-8 overflow-y-auto">
        <Card className="mb-6 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold text-primary">
              Başvuru Detayları
            </CardTitle>
            <StatusBadge status={applicationDetails?.status} />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-semibold text-gray-600">Başvuran:</p>
                <p className="text-lg">{applicationDetails?.applicantName || "Bilgi bulunamadı"}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-600">Başvuru Tarihi:</p>
                <p className="text-lg">{formatDateNoHours(applicationDetails?.applicationDate)}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-600">İş Başlığı:</p>
                <p className="text-lg">{applicationDetails?.jobTitle || "Bilgi bulunamadı"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4">
            <TabsTrigger value="resume">Özgeçmiş</TabsTrigger>
            <TabsTrigger value="coverLetter">Ön Yazı</TabsTrigger>
            <TabsTrigger value="certificates">Sertifikalar</TabsTrigger>
            <TabsTrigger value="actions">İşlemler</TabsTrigger>
          </TabsList>
          <TabsContent value="resume">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Özgeçmiş Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                {resumeDetails ? (
                  <div className="space-y-6">
                    <ResumeSection icon={FileText} title="Özet" content={resumeDetails.summary} />
                    <ResumeSection icon={GraduationCap} title="Eğitim" content={resumeDetails.education} />
                    <ResumeSection icon={Briefcase} title="Deneyim" content={resumeDetails.experience} />
                    <ResumeSection icon={Award} title="Beceriler" content={resumeDetails.skills} />
                    <ResumeSection icon={Languages} title="Diller" content={resumeDetails.languages} />
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Özgeçmiş bilgisi bulunamadı.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="coverLetter">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Ön Yazı</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{applicationDetails?.coverLetter || "Bilgi bulunamadı"}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="certificates">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Sertifikalar</CardTitle>
              </CardHeader>
              <CardContent>
                {applicationDetails?.certificates && applicationDetails.certificates.length > 0 ? (
                  <div className="space-y-4">
                    {applicationDetails.certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow"
                      >
                        <p className="font-medium text-gray-700">{cert.certificateName}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(cert.filePath, "_blank")}
                          className="hover:bg-primary hover:text-white transition-colors"
                        >
                          Görüntüle
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Sertifika bilgisi bulunamadı.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="actions">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Başvuru İşlemleri</CardTitle>
              </CardHeader>
              <CardContent>
                {isApplicationProcessed ? (
                  <p className="text-lg font-medium text-gray-700">
                    Bu başvuru {applicationDetails?.status === "Approved" ? "onaylanmış" : "reddedilmiş"} durumda ve değiştirilemez.
                  </p>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white transition-colors"
                      onClick={() => openConfirmDialog("approve")}
                      disabled={statusUpdating}
                    >
                      <CheckCircle className="mr-2 h-5 w-5" /> Onayla
                    </Button>
                    <Button
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white transition-colors"
                      onClick={() => openConfirmDialog("reject")}
                      disabled={statusUpdating}
                    >
                      <XCircle className="mr-2 h-5 w-5" /> Reddet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ConfirmDialog
          isOpen={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          onConfirm={handleConfirmAction}
          action={confirmAction}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>İşlem Başarılı</DialogTitle>
            </DialogHeader>
            <p>{successMessage}</p>
            <DialogFooter>
              <Button onClick={() => router.push("/company/applicants")}>
                Başvuru Listesine Dön
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

const ResumeSection: React.FC<{ icon: React.ElementType; title: string; content: string }> = ({
  icon: Icon,
  title,
  content
}) => (
  <div className="space-y-2">
    <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
      <Icon className="h-5 w-5" /> {title}
    </h3>
    <p className="text-gray-700 pl-7">{content}</p>
  </div>
)

const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "approve" | "reject" | null;
}> = ({ isOpen, onClose, onConfirm, action }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{action === "approve" ? "Başvuruyu Onayla" : "Başvuruyu Reddet"}</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        {action === "approve"
          ? "Bu başvuruyu onaylamak istediğinizden emin misiniz?"
          : "Bu başvuruyu reddetmek istediğinizden emin misiniz?"}
      </DialogDescription>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>İptal</Button>
        <Button
          onClick={onConfirm}
          className={action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
        >
          {action === "approve" ? "Onayla" : "Reddet"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default ApplicantDetails

