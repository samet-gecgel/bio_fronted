"use client";

import React, { useEffect, useState } from "react";
import { SuperAdminSidebar } from "@/components/custom/SuperAdminComponents/SuperAdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserFilters } from "@/components/custom/SuperAdminComponents/User/UserFilters";
import { UserTable } from "@/components/custom/SuperAdminComponents/User/UserTable";
import { IUser } from "@/types/user";
import { ApplicationStatus } from "@/types/enums/applicationStatus";
import { PaginationCustom } from "@/components/custom/PaginationCustom";
import { useRouter } from "next/navigation";
import getRoleFromToken from "@/utils/getRoleFromTokens"; 
import { userAPI } from "@/app/api";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const UserListPage: React.FC = () => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const itemsPerPage = 8;

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const role = getRoleFromToken(token);
    if (role !== "SuperAdmin") {
      router.push("/"); 
      return;
    }
  }, [router]);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const response = await userAPI.getPaged(page, itemsPerPage);
      setAllUsers(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Kullanıcılar alınırken bir hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!selectedUserId) return;

    try {
      await userAPI.delete(selectedUserId);
      setDialogMessage("Kullanıcı başarıyla silindi!");
      setShowDialog(true);
      fetchUsers(currentPage);
    } catch (error) {
      console.error("Kullanıcı silme hatası:", error);
      setDialogMessage("Kullanıcı silme işlemi başarısız!");
      setShowDialog(true);
    } finally {
      setSelectedUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    let users = allUsers;

    if (selectedStatus !== null) {
      users = users.filter((user) => user.approvalStatus === selectedStatus);
    }

    if (searchTerm) {
      users = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTotalPages(Math.ceil(users.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    setFilteredUsers(users.slice(startIndex, startIndex + itemsPerPage));
  }, [allUsers, searchTerm, selectedStatus, currentPage]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [searchTerm, selectedStatus]);

  // const handleStatusChange = (value: string) => {
  //   setSelectedStatus(
  //     value === "Tümü" ? null : (parseInt(value, 10) as ApplicationStatus)
  //   );
  // };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="overflow-y-hidden">
        <SuperAdminSidebar />
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-6 md:p-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Kullanıcılar
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Filters and Table */}
        <Card className="flex flex-col min-h-[calc(100vh-180px)]">
          <CardContent className="p-6">
            <UserFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            ) : (
              <UserTable
                users={filteredUsers}
                onEdit={(id) => router.push(`/super-admin/users/edit/${id}`)}
                onDelete={(id) => {
                  setSelectedUserId(id);
                  setDialogMessage("Bu kullanıcıyı silmek istediğinize emin misiniz?");
                  setShowDialog(true);
                }}
              />
            )}
            <div className="mt-6 flex justify-center">
              <PaginationCustom
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bilgilendirme</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setDialogMessage("");
              }}
            >
              İptal
            </Button>
            {selectedUserId && dialogMessage === "Bu kullanıcıyı silmek istediğinize emin misiniz?" && (
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDialog(false);
                  deleteUser();
                }}
              >
                Sil
              </Button>
            )}
            {dialogMessage !== "Bu kullanıcıyı silmek istediğinize emin misiniz?" && (
              <Button
                variant="default"
                onClick={() => {
                  setShowDialog(false);
                  setDialogMessage("");
                }}
              >
                Tamam
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserListPage;
