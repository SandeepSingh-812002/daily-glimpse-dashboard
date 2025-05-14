
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useReports } from "@/context/ReportContext";
import ReportModal from "@/components/report/ReportModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Report, ReportStatus } from "@/types";

const getReportStatus = (report: Report | undefined): ReportStatus => {
  if (!report) return "none";
  if (report.isOnLeave) return "on-leave";
  if (report.isHalfDay) return "half-day";
  return "completed";
};

const CalendarView = () => {
  const { reports, getReportByDate } = useReports();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
  };

  const selectedReport = selectedDate ? getReportByDate(selectedDate) : undefined;
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendar View</h2>
        <Button 
          onClick={() => {
            setSelectedDate(new Date());
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Report
        </Button>
      </div>
      
      <div className="border rounded-lg p-4 bg-white">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          modifiers={{
            completed: (date) => {
              const report = getReportByDate(date);
              return report ? !report.isOnLeave && !report.isHalfDay : false;
            },
            "on-leave": (date) => {
              const report = getReportByDate(date);
              return report ? report.isOnLeave : false;
            },
            "half-day": (date) => {
              const report = getReportByDate(date);
              return report ? report.isHalfDay : false;
            }
          }}
          modifiersClassNames={{
            completed: "bg-green-500 text-white hover:bg-green-600",
            "on-leave": "bg-red-500 text-white hover:bg-red-600",
            "half-day": "bg-yellow-500 text-white hover:bg-yellow-600"
          }}
          className="mx-auto"
        />
      </div>

      {isModalOpen && (
        <ReportModal
          date={selectedDate || new Date()}
          report={selectedReport}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CalendarView;
