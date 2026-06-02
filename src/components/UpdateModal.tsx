import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UpdateInfo } from "@/hooks/useUpdateCheck";

interface UpdateModalProps {
  updateInfo: UpdateInfo | null;
  onDownload: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateModal({
  updateInfo,
  onDownload,
  isOpen,
  onClose,
}: UpdateModalProps) {
  if (!updateInfo) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">
            Nueva versión disponible
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-foreground">
              {updateInfo.currentVersion} → {updateInfo.latestVersion}
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="text-sm font-medium mb-2">Cambios:</div>
            <div className="text-sm text-muted-foreground line-clamp-4">
              {updateInfo.releaseNotes}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <AlertDialogCancel>No ahora</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDownload}
            className="bg-green-600 hover:bg-green-700"
          >
            Actualizar
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
