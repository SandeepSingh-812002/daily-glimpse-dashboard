
import { useState } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useReports } from "@/context/ReportContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Mock data for employees with roles instead of positions
const employees = [
  { id: "1", name: "John Doe", role: "Team Lead" },
  { id: "2", name: "Jane Smith", role: "Employee" },
  { id: "3", name: "Mike Johnson", role: "Employee" },
  { id: "4", name: "Sarah Williams", role: "Manager" },
  { id: "5", name: "Alex Brown", role: "Employee" },
];

// Mock data for today's reports
const dummyTasks = [
  { id: "t1", description: "Complete project documentation", status: "Completed", completion_percentage: 100 },
  { id: "t2", description: "Attend team meeting", status: "Completed", completion_percentage: 100 },
  { id: "t3", description: "Review pull requests", status: "In Progress", completion_percentage: 70 },
  { id: "t4", description: "Fix bug in login flow", status: "In Progress", completion_percentage: 50 },
  { id: "t5", description: "Prepare presentation slides", status: "Not Started", completion_percentage: 0 },
];

// Create dummy reports for today
const generateDummyReports = () => {
  const today = new Date();
  
  return [
    {
      id: "r1",
      user_id: "1",
      date: today.toISOString(),
      created_at: today.toISOString(),
      is_on_leave: false,
      is_half_day: false,
      tasks: [dummyTasks[0], dummyTasks[1]],
    },
    {
      id: "r2",
      user_id: "2",
      date: today.toISOString(),
      created_at: today.toISOString(),
      is_on_leave: false,
      is_half_day: true,
      tasks: [dummyTasks[2]],
    },
    {
      id: "r3",
      user_id: "3",
      date: today.toISOString(),
      created_at: today.toISOString(),
      is_on_leave: true,
      is_half_day: false,
      tasks: [],
    },
    {
      id: "r4",
      user_id: "4",
      date: today.toISOString(),
      created_at: today.toISOString(),
      is_on_leave: false,
      is_half_day: false,
      tasks: [dummyTasks[3], dummyTasks[4]],
    },
  ];
};

const EmployeeManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<null | { id: string; name: string }>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { reports } = useReports();
  
  // We'll use the real reports from context but fallback to dummy data if empty
  const allReports = reports.length > 0 ? reports : generateDummyReports();

  const handleEmployeeClick = (employee: { id: string; name: string }) => {
    setSelectedEmployee(employee);
    setIsCalendarOpen(true);
  };

  const handleViewReport = (employeeId: string, date: Date) => {
    // Close the calendar dialog
    setIsCalendarOpen(false);
    
    // Instead of navigating, we'll toggle a dialog - but kept comment for reference
    // navigate(`/dashboard?employeeId=${employeeId}&date=${format(date, "yyyy-MM-dd")}`);
    
    // We'll open the calendar dialog with the selected employee and date
    setSelectedEmployee({ id: employeeId, name: employees.find(e => e.id === employeeId)?.name || "Employee" });
    setSelectedDate(date);
    setIsCalendarOpen(true);
  };

  // Filter reports for selected employee and date
  const getEmployeeReportForDate = (employeeId: string, date: Date) => {
    return allReports.find(report => 
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

  // Get today's reports from actual report context
  const getTodaysReports = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const filtered = allReports.filter(report => 
      format(new Date(report.date), "yyyy-MM-dd") === today
    );
    return filtered;
  };

  const todaysReports = getTodaysReports();

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
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>
                        <Badge variant={
                          employee.role === "Manager" ? "default" : 
                          employee.role === "Team Lead" ? "secondary" : "outline"
                        }>
                          {employee.role}
                        </Badge>
                      </TableCell>
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
              {todaysReports.length > 0 ? (
                <div className="space-y-6">
                  {todaysReports.map((report) => {
                    const employee = employees.find(emp => emp.id === report.user_id) || { name: "Unknown Employee" };
                    return (
                      <Card key={report.id} className="border border-gray-200">
                        <CardHeader className="bg-gray-50 pb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">Daily Report</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <span>{employee.name}</span>
                                <span>•</span>
                                <span>{format(new Date(report.created_at), "h:mm a")}</span>
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div>
                              {report.is_on_leave ? (
                                <p className="text-gray-700">On leave today</p>
                              ) : report.is_half_day ? (
                                <p className="text-gray-700">Working half day</p>
                              ) : (
                                <p className="text-gray-700">Regular working day</p>
                              )}
                            </div>
                            
                            {!report.is_on_leave && report.tasks.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium text-sm mb-2">Tasks:</h4>
                                <div className="space-y-2">
                                  {report.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between text-sm border-b pb-2">
                                      <div className="flex-1">{task.description}</div>
                                      <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                          task.status === "Completed" ? "bg-green-100 text-green-800" :
                                          task.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                                          "bg-gray-100 text-gray-800"
                                        }`}>
                                          {task.status}
                                        </span>
                                        <span className="text-gray-500">{task.completion_percentage}%</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reports submitted today
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee Calendar Dialog */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEmployee?.name}'s Calendar</DialogTitle>
            <DialogDescription>
              Select a date to view or manage reports
            </DialogDescription>
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
