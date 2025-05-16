
import { useState } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useReports } from "@/context/ReportContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data for employees
const employees = [
  { id: "1", name: "John Doe", position: "Frontend Developer" },
  { id: "2", name: "Jane Smith", position: "UX Designer" },
  { id: "3", name: "Mike Johnson", position: "Backend Developer" },
  { id: "4", name: "Sarah Williams", position: "Project Manager" },
  { id: "5", name: "Alex Brown", position: "QA Engineer" },
];

// Mock data for today's reports
const todaysReports = [
  { id: "1", employeeId: "1", employeeName: "John Doe", title: "Frontend Sprint Progress", timestamp: new Date().setHours(9, 15) },
  { id: "2", employeeId: "2", employeeName: "Jane Smith", title: "UX Design Updates", timestamp: new Date().setHours(10, 30) },
  { id: "3", employeeId: "5", employeeName: "Alex Brown", title: "Testing Results", timestamp: new Date().setHours(14, 45) },
];

const EmployeeManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<null | { id: string; name: string }>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { reports } = useReports();
  const navigate = useNavigate();

  const handleEmployeeClick = (employee: { id: string; name: string }) => {
    setSelectedEmployee(employee);
    setIsCalendarOpen(true);
  };

  const handleViewReport = (employeeId: string, date: Date) => {
    // Close the calendar dialog
    setIsCalendarOpen(false);
    
    // Navigate to the dashboard with the employee's information
    navigate(`/dashboard?employeeId=${employeeId}&date=${format(date, "yyyy-MM-dd")}`);
  };

  // Filter reports for selected employee and date
  const getEmployeeReportForDate = (employeeId: string, date: Date) => {
    return reports.find(report => 
      report.user_id === employeeId && 
      format(new Date(report.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  // Get attendance status for the selected date
  const getAttendanceStatus = (employeeId: string, date: Date) => {
    const report = getEmployeeReportForDate(employeeId, date);
    if (!report) return "Absent";
    if (report.is_on_leave) return "On Leave";
    if (report.is_half_day) return "Half Day";
    return "Present";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employee Management</h1>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="employees">Employee List</TabsTrigger>
          <TabsTrigger value="today">Today's Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employees</CardTitle>
              <CardDescription>
                Click on an employee to view their calendar and reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          onClick={() => handleEmployeeClick(employee)}
                        >
                          View Calendar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Today's Reports</CardTitle>
              <CardDescription>
                Reports submitted today: {format(new Date(), "MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todaysReports.length > 0 ? (
                    todaysReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.employeeName}</TableCell>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>{format(new Date(report.timestamp), "h:mm a")}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline"
                            onClick={() => navigate(`/dashboard?reportId=${report.id}`)}
                          >
                            View Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No reports submitted today
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee Calendar Dialog */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEmployee?.name}'s Calendar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            
            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Attendance Status:</h3>
              <p>{selectedEmployee && getAttendanceStatus(selectedEmployee.id, selectedDate)}</p>
              
              <div className="mt-4">
                <Button 
                  className="w-full"
                  onClick={() => selectedEmployee && handleViewReport(selectedEmployee.id, selectedDate)}
                >
                  View Report Details
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
