
import { useState } from "react";
import CalendarView from "@/components/calendar/CalendarView";
import { useReports } from "@/context/ReportContext";

const Dashboard = () => {
  const { reports } = useReports();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Reports Dashboard</h1>
      
      <CalendarView />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Report Stats</h2>
        <p>Total Reports: {reports.length}</p>
      </div>
    </div>
  );
};

export default Dashboard;
