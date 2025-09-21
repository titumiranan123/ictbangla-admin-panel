"use client";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const DashboardPage = () => {
  const { data: dashboardData, isLoading, error } = useDashboard();

  // Calculate derived metrics
  const calculateMetrics = (data: any) => {
    if (!data) return {};

    // Calculate average conversion rate
    const monthsWithData = data?.enrollmentTrends?.filter(
      (t: any) => t.paid > 0 || t.unpaid > 0
    );
    const avgConversion =
      monthsWithData?.length > 0
        ? monthsWithData?.reduce(
            (sum: number, t: any) => sum + (t.conversionRate || 0),
            0
          ) / monthsWithData?.length
        : 0;

    // Calculate total revenue
    const totalRevenue = data?.enrollmentTrends?.reduce(
      (sum: number, t: any) => sum + t.revenue,
      0
    );

    // Calculate month-over-month growth
    let momGrowth = 0;
    if (data?.enrollmentTrends?.length > 1) {
      const lastMonth =
        data?.enrollmentTrends[data?.enrollmentTrends.length - 1].revenue;
      const prevMonth =
        data?.enrollmentTrends[data?.enrollmentTrends.length - 2].revenue;
      momGrowth =
        prevMonth > 0 ? ((lastMonth - prevMonth) / prevMonth) * 100 : 0;
    }

    return {
      averageConversionRate: avgConversion,
      totalRevenue,
      monthOverMonthGrowth: momGrowth,
      totalCourses: data?.summery.totalCourse,
    };
  };

  // Merge with original data
  const enhancedData = dashboardData
    ? {
        ...dashboardData,
        summery: {
          ...dashboardData?.summery,
          ...calculateMetrics(dashboardData),
          totalCompletedCourses: dashboardData?.summery.totalCompletedCourse,
          totalCourses: dashboardData?.summery.totalCourse,
        },
      }
    : null;

  // Enrollment chart data
  const enrollmentData = {
    labels: enhancedData?.enrollmentTrends.map((t: any) => t.month) || [],
    datasets: [
      {
        label: "Paid Enrollments",
        data: enhancedData?.enrollmentTrends.map((t: any) => t.paid) || [],
        backgroundColor: "#2E8B57",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#1e5b3a",
        hoverBackgroundColor: "#3cb371",
        hoverBorderColor: "#1e5b3a",
      },
      {
        label: "Unpaid Enrollments",
        data: enhancedData?.enrollmentTrends.map((t: any) => t.unpaid) || [],
        backgroundColor: "#DC143C",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#a80c2d",
        hoverBackgroundColor: "#ff4040",
        hoverBorderColor: "#a80c2d",
      },
      {
        label: "Completed Courses",
        data: enhancedData?.enrollmentTrends.map((t: any) => t.completed) || [],
        backgroundColor: "#4169E1",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#2a4ab0",
        hoverBackgroundColor: "#5a7aff",
        hoverBorderColor: "#2a4ab0",
      },
    ],
  };

  // Revenue trend line chart
  const revenueData = {
    labels: enhancedData?.enrollmentTrends.map((t: any) => t.month) || [],
    datasets: [
      {
        label: "Monthly Revenue (Tk.)",
        data: enhancedData?.enrollmentTrends.map((t: any) => t.revenue) || [],
        borderColor: "#8A2BE2",
        backgroundColor: "rgba(138, 43, 226, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "#8A2BE2",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Doughnut chart data
  const instructorStatusData = {
    labels: ["Approved", "Pending"],
    datasets: [
      {
        data: [
          enhancedData?.summery?.totalApprovedInstructors || 0,
          enhancedData?.summery?.totalPendingInstructors || 0,
        ],
        backgroundColor: ["#2E8B57", "#D1D5DB"],
        borderWidth: 0,
      },
    ],
  };

  const courseStatusData = {
    labels: ["Published", "Upcoming", "Rejected"],
    datasets: [
      {
        data: [
          enhancedData?.summery?.totalPublishedCourses || 0,
          enhancedData?.summery?.totalUpcomingCourses || 0,
          enhancedData?.summery?.totalRejectedCourses || 0,
        ],
        backgroundColor: ["#2E8B57", "#F59E0B", "#DC143C"],
        borderWidth: 0,
      },
    ],
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            label += context.parsed.y.toLocaleString();
            if (context.datasetIndex === 0) {
              const monthData =
                enhancedData?.enrollmentTrends[context.dataIndex];
              if (monthData) {
                label += ` (${monthData?.conversionRate}% conversion)`;
              }
            }
            return label;
          },
          footer: (tooltipItems: any[]) => {
            const total = tooltipItems.reduce((sum, tooltipItem) => {
              return sum + tooltipItem.parsed.y;
            }, 0);
            const monthData =
              enhancedData?.enrollmentTrends[tooltipItems[0].dataIndex];
            return [
              `Total: ${total.toLocaleString()}`,
              `Revenue:  Tk. ${monthData?.revenue.toLocaleString() || "0"}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
        ticks: {
          callback: function (value: any) {
            return value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    animation: {
      duration: 1000,
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Revenue:  Tk.${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          drawBorder: false,
        },
        ticks: {
          callback: function (value: any) {
            return ` Tk. ${value.toLocaleString()}`;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Skeleton loader component
  const SkeletonLoader = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">Failed to load dashboard data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Management Dashboard
        </h1>
        <p className="text-gray-600">Overview of your platform statistics</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {/* Users Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-purple-600 text-xl">👥</span>
            </div>
          </div>

          {isLoading ? (
            <>
              <SkeletonLoader className="h-8 w-1/2 mb-4" />
              <div className="space-y-3">
                <SkeletonLoader className="h-4 w-full" />
              </div>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-purple-600 mb-4">
                {enhancedData?.summery?.totalUsers.toLocaleString() || "0"}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active</span>
                  <span className="font-medium">
                    {Math.round(
                      enhancedData?.summery?.totalUsers * 0.72
                    ).toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enrollments Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Enrollments</h2>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">📚</span>
            </div>
          </div>

          {isLoading ? (
            <>
              <SkeletonLoader className="h-8 w-1/2 mb-4" />
              <div className="space-y-3">
                <SkeletonLoader className="h-4 w-full" />
              </div>
            </>
          ) : (
            <>
              <p className="text-3xl hidden font-bold text-blue-600 mb-4">
                {enhancedData?.summery?.totalEnrol.toLocaleString() ?? "0"}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Paid</span>
                  <span className="font-medium text-green-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {enhancedData?.summery?.totalPaidEnrol.toLocaleString() ||
                      "0"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium text-indigo-600">
                    {enhancedData?.summery?.totalCompletedCourse.toLocaleString() ||
                      "0"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Revenue</h2>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-green-600 text-xl">💰</span>
            </div>
          </div>

          {isLoading ? (
            <>
              <SkeletonLoader className="h-8 w-1/2 mb-4" />
              <div className="space-y-3">
                <SkeletonLoader className="h-4 w-full" />
              </div>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-green-600 mb-4">
                Tk.{" "}
                {enhancedData?.summery?.totalRevenue?.toLocaleString() || "0"}
              </p>
            </>
          )}
        </div>

        {/* Courses Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Courses</h2>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 text-xl">🎓</span>
            </div>
          </div>

          {isLoading ? (
            <>
              <SkeletonLoader className="h-8 w-1/2 mb-4" />
              <div className="space-y-3">
                <SkeletonLoader className="h-4 w-full" />
              </div>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-yellow-600 mb-4">
                {enhancedData?.summery?.totalCourse.toLocaleString() || "0"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enrollment Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Enrollment Trends
            </h2>
            {!isLoading && (
              <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                <span className="font-medium text-green-600">
                  ↑{" "}
                  {enhancedData?.summery?.monthOverMonthGrowth?.toFixed(1) ||
                    "0"}
                  %
                </span>{" "}
                MoM Growth
              </div>
            )}
          </div>
          {isLoading ? (
            <SkeletonLoader className="h-64 w-full" />
          ) : (
            <div className="h-64">
              <Bar data={enrollmentData} options={barChartOptions as any} />
            </div>
          )}
          {!isLoading && (
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Avg. Conversion</p>
                <p className="font-bold text-green-600">
                  {enhancedData?.summery?.averageConversionRate?.toFixed(1) ||
                    "0"}
                  %
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="font-bold text-blue-600">
                  Tk.{" "}
                  {enhancedData?.summery?.totalRevenue?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="font-bold text-purple-600">
                  {enhancedData?.summery?.totalCompletedCourse?.toLocaleString() ||
                    "0"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status Doughnuts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Status Overview
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonLoader className="h-64 w-full" />
              <SkeletonLoader className="h-64 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2 text-center">
                  Instructors
                </h3>
                <div className="h-48">
                  <Doughnut
                    data={instructorStatusData}
                    options={{
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context: any) {
                              const label = context.label || "";
                              const value = context.raw || 0;
                              const total = context.dataset.data?.reduce(
                                (a: number, b: number) => a + b,
                                0
                              );
                              const percentage = Math.round(
                                (value / total) * 100
                              );
                              return `${label}: ${value} (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2 text-center">
                  Courses
                </h3>
                <div className="h-48">
                  <Doughnut
                    data={courseStatusData}
                    options={{
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context: any) {
                              const label = context.label || "";
                              const value = context.raw || 0;
                              const total = context.dataset.data?.reduce(
                                (a: number, b: number) => a + b,
                                0
                              );
                              const percentage = Math.round(
                                (value / total) * 100
                              );
                              return `${label}: ${value} (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Chart Row */}
      <div className="grid grid-cols-1  gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Revenue Trend
          </h2>
          {isLoading ? (
            <SkeletonLoader className="h-64 w-full" />
          ) : (
            <div className="h-64">
              <Line data={revenueData} options={lineChartOptions as any} />
            </div>
          )}
        </div>
      </div>

      {/* Top Courses Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Top Performing Courses
        </h2>
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonLoader className="h-12 w-full" />
            <SkeletonLoader className="h-12 w-full" />
            <SkeletonLoader className="h-12 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enhancedData?.topCourses.map((course: any) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        <span>Course #{course.id.slice(-6)}</span>
                        <span>{course?.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {course.enrollments.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-green-600 font-medium">
                        {" "}
                        Tk.{course.revenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>4.7</span>
                        <span className="text-gray-400 ml-1">/5</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
