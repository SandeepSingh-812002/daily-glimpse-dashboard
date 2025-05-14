
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { Report, Task } from "@/types";
import { cn } from "@/lib/utils";
import { useReports } from "@/context/ReportContext";
import TaskItem from "@/components/report/TaskItem";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const ReportForm = () => {
  const navigate = useNavigate();
  const { addReport, getReportByDate } = useReports();
  const [date, setDate] = useState<Date>(new Date());
  const [isOnLeave, setIsOnLeave] = useState(false);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: uuidv4(),
      description: "",
      completionPercentage: 0,
      status: "Pending",
      issuedBy: "",
      project: "",
    },
  ]);

  // Load existing report if available
  const loadExistingReport = (date: Date) => {
    const existingReport = getReportByDate(date);
    if (existingReport) {
      setIsOnLeave(existingReport.isOnLeave);
      setIsHalfDay(existingReport.isHalfDay);
      setTasks(existingReport.tasks);
    } else {
      // Reset form for new date
      setIsOnLeave(false);
      setIsHalfDay(false);
      setTasks([
        {
          id: uuidv4(),
          description: "",
          completionPercentage: 0,
          status: "Pending",
          issuedBy: "",
          project: "",
        },
      ]);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      loadExistingReport(date);
    }
  };

  const handleTaskChange = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        id: uuidv4(),
        description: "",
        completionPercentage: 0,
        status: "Pending",
        issuedBy: "",
        project: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!isOnLeave) {
      const hasEmptyRequiredFields = tasks.some(task => !task.description || !task.issuedBy);
      if (hasEmptyRequiredFields) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    const report: Report = {
      id: uuidv4(),
      date,
      isOnLeave,
      isHalfDay,
      tasks: isOnLeave ? [] : tasks,
    };

    addReport(report);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Daily Report Submission</h1>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
            <CardDescription>Submit your daily report for tasks completed</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Date Selector */}
            <div className="space-y-2">
              <Label htmlFor="date">Report Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

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
                  className={cn("font-medium", isOnLeave ? "text-gray-400" : "")}
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
                    <Plus className="h-4 w-4" /> Add Task
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
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full sm:w-auto">Submit Report</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ReportForm;
