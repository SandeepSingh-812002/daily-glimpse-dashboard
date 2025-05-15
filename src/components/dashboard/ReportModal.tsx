
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Report, ReportingTask } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Save } from "lucide-react";
import TaskItem from "@/components/report/TaskItem";
import { useNavigate } from "react-router-dom";
import { useReports } from "@/context/ReportContext";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface ReportModalProps {
  report: Report | null;
  selectedDate: Date;
  isOpen: boolean;
  onClose: () => void;
}

const ReportModal = ({ report, selectedDate, isOpen, onClose }: ReportModalProps) => {
  const navigate = useNavigate();
  const { addReport, deleteReport, getReportByDate } = useReports();
  
  const [date, setDate] = useState<Date>(selectedDate);
  const [isOnLeave, setIsOnLeave] = useState(false);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [tasks, setTasks] = useState<ReportingTask[]>([
    {
      id: uuidv4(),
      reporting_id: "",
      task_id: uuidv4(),
      description: "",
      completion_percentage: 0,
      status: "Pending",
      created_at: new Date()
    },
  ]);
  
  // Set initial form values when report or selectedDate changes
  useEffect(() => {
    if (report) {
      setDate(new Date(report.date));
      setIsOnLeave(report.is_on_leave);
      setIsHalfDay(report.is_half_day);
      setTasks(report.tasks);
    } else {
      setDate(selectedDate);
      setIsOnLeave(false);
      setIsHalfDay(false);
      setTasks([
        {
          id: uuidv4(),
          reporting_id: "",
          task_id: uuidv4(),
          description: "",
          completion_percentage: 0,
          status: "Pending",
          created_at: new Date()
        },
      ]);
    }
  }, [report, selectedDate]);

  const handleTaskChange = (updatedTask: ReportingTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        id: uuidv4(),
        reporting_id: "",
        task_id: uuidv4(),
        description: "",
        completion_percentage: 0,
        status: "Pending",
        created_at: new Date()
      },
    ]);
  };

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((task) => task.id !== id));
    } else {
      toast.error("At least one task is required");
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!isOnLeave) {
      const hasEmptyRequiredFields = tasks.some(task => !task.description);
      if (hasEmptyRequiredFields) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    const updatedReport: Report = {
      id: report ? report.id : uuidv4(),
      user_id: report ? report.user_id : "current-user", // Replace with actual user ID handling
      date,
      is_on_leave: isOnLeave,
      is_half_day: isHalfDay,
      created_at: report ? report.created_at : new Date(),
      tasks: isOnLeave ? [] : tasks,
    };

    addReport(updatedReport);
    toast.success(report ? "Report updated successfully" : "Report created successfully");
    onClose();
  };

  const handleDelete = () => {
    if (report) {
      deleteReport(report.id);
      toast.success("Report deleted successfully");
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const isEditMode = !!report;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Report" : "New Report"}: {format(date, "MMMM d, yyyy")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Leave Status */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="leave"
                checked={isOnLeave}
                onCheckedChange={(checked) => {
                  setIsOnLeave(checked === true);
                  if (checked) {
                    setIsHalfDay(false);
                  }
                }}
              />
              <Label htmlFor="leave" className="font-medium">On Leave</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="halfday"
                checked={isHalfDay}
                disabled={isOnLeave}
                onCheckedChange={(checked) => {
                  setIsHalfDay(checked === true);
                }}
              />
              <Label
                htmlFor="halfday"
                className={isOnLeave ? "text-gray-400 font-medium" : "font-medium"}
              >
                Half Day
              </Label>
            </div>
          </div>

          {/* Tasks */}
          {!isOnLeave && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTask}
                  className="flex items-center gap-1"
                >
                  <span className="h-4 w-4">+</span> Add Task
                </Button>
              </div>

              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onChange={handleTaskChange}
                    onDelete={() => removeTask(task.id)}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {isEditMode ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSubmit}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" /> Save
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSubmit}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" /> Save
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
