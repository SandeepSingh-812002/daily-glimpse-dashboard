
import { createContext, useContext, useState, ReactNode } from "react";
import { Report, ReportingTask } from "@/types";
import { format, isSameDay } from "date-fns";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface ReportContextType {
  reports: Report[];
  addReport: (report: Report) => void;
  updateReport: (report: Report) => void;
  deleteReport: (id: string) => void;
  getReportByDate: (date: Date) => Report | undefined;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>([]);

  const addReport = (report: Report) => {
    // Check if a report already exists for this date
    const existingReportIndex = reports.findIndex(r => 
      isSameDay(new Date(r.date), new Date(report.date))
    );
    
    if (existingReportIndex !== -1) {
      // Update existing report
      const updatedReports = [...reports];
      updatedReports[existingReportIndex] = report;
      setReports(updatedReports);
      toast.success("Report updated successfully!");
    } else {
      // Add new report
      setReports([...reports, report]);
      toast.success("Report submitted successfully!");
    }
  };

  const updateReport = (report: Report) => {
    setReports(reports.map(r => r.id === report.id ? report : r));
    toast.success("Report updated successfully!");
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter(report => report.id !== id));
    toast.success("Report deleted successfully!");
  };

  const getReportByDate = (date: Date) => {
    return reports.find(report => 
      isSameDay(new Date(report.date), date)
    );
  };

  return (
    <ReportContext.Provider value={{ reports, addReport, updateReport, deleteReport, getReportByDate }}>
      {children}
    </ReportContext.Provider>
  );
};
