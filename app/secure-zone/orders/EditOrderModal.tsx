"use client";

import { useState, useEffect } from "react";
import useCourseList from "@/hooks/useCourseList";
import { api_url } from "@/hooks/apiurl";
import toast from "react-hot-toast";
import UserFilter from "./UserFilter";

interface EditOrderModalProps {
  onClose: () => void;
  refetch: () => void;
}

const EditOrderModal = ({ onClose, refetch }: EditOrderModalProps) => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [manualUserInfo, setManualUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [formData, setFormData] = useState<any>({
    courses: [{ courseId: "" }],
  });
  const [submitting, setSubmitting] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    perPage: 100,
    orderBy: "",
    searchText: "",
    basicStatus: "",
    status: "",
  });

  const { data: courseData, isLoading: courseLoading } = useCourseList(filters);

  useEffect(() => {
    // reset page to 1 when filters.searchText changes (mimic earlier behaviour)
    // but we already set page in handleFilterChange; keep effect minimal.
  }, [filters.searchText]);

  const handleChange = (field: keyof any, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleManualUserInfoChange = (field: string, value: string) => {
    setManualUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleCourseChange = (index: number, field: string, value: any) => {
    const updatedCourses = [...(formData.courses || [])];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    handleChange("courses", updatedCourses);
  };

  const addNewCourse = () => {
    handleChange("courses", [
      ...(formData.courses || []),
      {
        courseId: "",
      },
    ]);
  };

  const removeCourse = (index: number) => {
    const updatedCourses = [...(formData.courses || [])];
    updatedCourses.splice(index, 1);
    handleChange("courses", updatedCourses);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!selectedUser && (!manualUserInfo.name || !manualUserInfo.email)) {
      toast.error("Please select a user or provide name and email");
      return;
    }

    if (
      !formData.courses ||
      formData.courses.length === 0 ||
      !formData.courses[0].courseId
    ) {
      toast.error("Please add at least one course");
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        ...formData,
      };

      // If no user selected, include manual user info
      if (!selectedUser) {
        payload.email = manualUserInfo.email;
        payload.phone = manualUserInfo.phone;
        payload.name = manualUserInfo.name;
      } else {
        payload.userId = selectedUser;
      }

      const res = await api_url.post(
        "/v1/admin-user/manual-course-registration",
        payload
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Order created successfully!");
        refetch();
        onClose();
      } else {
        toast.error("Failed to create order");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      perPage: 100,
      orderBy: "",
      searchText: "",
      basicStatus: "",
      status: "",
    });
  };

  const selectedCoursesCount = (formData.courses || []).filter(
    (course: any) => course.courseId
  ).length;

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    // Overlay + centered modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[70vh] bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-y-scroll">
        {/* Header */}
        <div className="flex sticky top-0  backdrop-blur-2xl items-center justify-between px-6 py-4  z-20 bg-green-200">
          <div className="flex items-center gap-3 ">
            {/* simple book icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a2 2 0 012-2h11a2 2 0 012 2v16"
              />
            </svg>
            <h3 className="text-lg font-semibold">Create Manual Order</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Customer Information */}
          <section className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a5 5 0 100-10 5 5 0 000 10z" />
                <path
                  fillRule="evenodd"
                  d="M.458 17.042A9 9 0 1117.042.458 13 13 0 0010 18a13 13 0 00-9.542-.958z"
                  clipRule="evenodd"
                />
              </svg>
              <h4 className="font-semibold">Customer Information</h4>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Select Customer
              </label>
              <UserFilter
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
              <p className="text-xs text-gray-500 mt-2">
                Search for existing users or fill out the form below for new
                customers
              </p>
            </div>

            {!selectedUser && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={manualUserInfo.name}
                    onChange={(e) =>
                      handleManualUserInfoChange("name", e.target.value)
                    }
                    required
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={manualUserInfo.email}
                    onChange={(e) =>
                      handleManualUserInfoChange("email", e.target.value)
                    }
                    type="email"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={manualUserInfo.phone}
                    onChange={(e) =>
                      handleManualUserInfoChange("phone", e.target.value)
                    }
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
              </div>
            )}

            {selectedUser && (
              <div className="mt-3 bg-blue-50 text-blue-800 px-3 py-2 rounded-md text-sm">
                Customer selected. Now add courses to their order.
              </div>
            )}
          </section>

          {/* Course Information */}
          <section className="border rounded-lg p-4">
            <div className="flex md:flex-row flex-col gap-4 items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                <h4 className="font-semibold">Course Information</h4>
                {selectedCoursesCount > 0 && (
                  <span className="ml-2 inline-flex items-center rounded-md border px-2 py-0.5 text-xs text-primary-700">
                    {selectedCoursesCount} course(s) selected
                  </span>
                )}
              </div>

              <div className="grid-cols-3  grid  items-center gap-4">
                <input
                  className="rounded-md col-span-3 border px-3 py-1 text-sm"
                  placeholder="Search courses..."
                  value={filters.searchText}
                  onChange={(e) =>
                    handleFilterChange("searchText", e.target.value)
                  }
                />
                <select
                  className="rounded-md border px-2 py-1 text-sm"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="UPCOMING">Upcoming</option>
                </select>
                <select
                  className="rounded-md border px-2 py-1 text-sm"
                  value={filters.basicStatus}
                  onChange={(e) =>
                    handleFilterChange("basicStatus", e.target.value)
                  }
                >
                  <option value="">All</option>
                  <option value="FREE">Free</option>
                  <option value="PAID">Paid</option>
                </select>
                <button
                  onClick={resetFilters}
                  className="text-sm rounded-md border px-3 py-1 hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {(formData.courses || []).map((course: any, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-md border border-dashed bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-primary-600">
                        Course {index + 1}
                      </div>
                      {index > 0 && (
                        <button
                          onClick={() => removeCourse(index)}
                          className="text-sm text-red-600 hover:underline"
                          type="button"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="mt-2">
                      <select
                        value={course.courseId || ""}
                        onChange={(e) =>
                          handleCourseChange(index, "courseId", e.target.value)
                        }
                        disabled={courseLoading}
                        className="w-full rounded-md border px-3 py-2 text-sm"
                      >
                        <option value="">Select Course</option>
                        {courseLoading ? (
                          <option disabled>Loading courses...</option>
                        ) : (
                          courseData?.courses?.map((c: any) => (
                            <option key={c._id} value={c._id}>
                              {c?.basicInfo?.title || "Untitled Course"} — Tk.
                              {c?.pricing?.price?.main || 0}{" "}
                              {c?.pricing?.price?.discount && (
                                <span>
                                  / Discount :{c?.pricing?.price?.discount} Tk.
                                </span>
                              )}
                              {c?.pricing?.price?.percentage !== 0 && (
                                <span>
                                  / Discount :{c?.pricing?.price?.percentage}{" "}
                                  Tk.
                                </span>
                              )}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <button
                onClick={addNewCourse}
                className="w-full md:w-auto inline-flex items-center justify-center  gap-2 rounded-md border px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                type="button"
              >
                + Add Another Course
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || selectedCoursesCount === 0}
            className={`rounded-md px-4 py-2 text-sm text-white ${
              submitting || selectedCoursesCount === 0
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {submitting ? "Creating Order..." : "Create Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
