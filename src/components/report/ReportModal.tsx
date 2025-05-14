
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Report } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2 } from "lucide-react";
import TaskItem from "@/components/report/TaskItem";
import { useReports } from "@/context/ReportContext";

interface ReportModalProps {
  date: Date;
  report?: Report;
  isOpen: boolean;
  onClose: () => void;
}

const ReportModal = ({ date, report, isOpen, onClose }: ReportModalProps) => {
  const navigate = useNavigate();
  const { deleteReport } = useReports();

  const handleAddOrEdit = () => {
    navigate("/report", { state: { selectedDate: date } });
    onClose();
  };

  const handleDelete = () => {
    if (report) {
      deleteReport(report.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {report ? "Report Details" : "No Report"}: {format(date, "MMMM d, yyyy")}
          </DialogTitle>
          {report && (
            <div className="flex gap-2 mt-2">
              {report.isOnLeave && <Badge className="bg-red-500">On Leave</Badge>}
              {report.isHalfDay && <Badge className="bg-yellow-500">Half Day</Badge>}
              {!report.isOnLeave && !report.isHalfDay && (
                <Badge className="bg-green-500">Full Day</Badge>
              )}
            </div>
          )}
        </DialogHeader>

        {report ? (
          <>
            {!report.isOnLeave && report.tasks.length > 0 && (
              <div className="my-4">
                <h3 className="text-lg font-semibold mb-4">Tasks</h3>
                <div className="space-y-4">
                  {report.tasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onChange={() => {}}
                      onDelete={() => {}}
                      disabled={true}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleAddOrEdit}
                className="flex items-center gap-1"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-4">No report for this date</p>
            <Button 
              onClick={handleAddOrEdit}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Report
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
