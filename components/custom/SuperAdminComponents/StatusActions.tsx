import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ApplicationStatus } from "@/types/enums/applicationStatus";

interface StatusActionsProps {
  currentStatus: ApplicationStatus;
  onActionClick: (action: ApplicationStatus) => void;
}

export const StatusActions: React.FC<StatusActionsProps> = ({
  currentStatus,
  onActionClick,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<ApplicationStatus | null>(
    null
  );

  const handleDialogOpen = (action: ApplicationStatus) => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (dialogAction !== null) {
      onActionClick(dialogAction);
    }
    setDialogOpen(false);
    setDialogAction(null);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setDialogAction(null);
  };

  return (
    <>
      {currentStatus === ApplicationStatus.Pending ? (
        <div className="flex gap-2">
          <Button
            variant="default"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => handleDialogOpen(ApplicationStatus.Approved)}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Onayla
          </Button>
          <Button
            variant="default"
            className="bg-red-500 hover:bg-red-600"
            onClick={() => handleDialogOpen(ApplicationStatus.Rejected)}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reddet
          </Button>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              Durumu Değiştir
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleDialogOpen(ApplicationStatus.Approved)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
              Onayla
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDialogOpen(ApplicationStatus.Rejected)}
            >
              <XCircle className="w-4 h-4 mr-2 text-red-500" />
              Reddet
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDialogOpen(ApplicationStatus.Pending)}
            >
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
              Beklemede
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === ApplicationStatus.Approved
                ? "Bu işi onaylamak istediğinize emin misiniz?"
                : dialogAction === ApplicationStatus.Rejected
                ? "Bu işi reddetmek istediğinize emin misiniz?"
                : "Bu işi beklemeye almak istediğinize emin misiniz?"}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogCancel}>
              İptal
            </Button>
            <Button
              variant={
                dialogAction === ApplicationStatus.Approved
                  ? "default"
                  : dialogAction === ApplicationStatus.Rejected
                  ? "destructive"
                  : "secondary"
              }
              onClick={handleDialogConfirm}
            >
              {dialogAction === ApplicationStatus.Approved
                ? "Onayla"
                : dialogAction === ApplicationStatus.Rejected
                ? "Reddet"
                : "Beklemeye Al"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
