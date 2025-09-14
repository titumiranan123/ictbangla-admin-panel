"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
  Divider,
  Avatar,
  IconButton,
  Paper,
  Chip,
  InputAdornment,
  Alert,
  FormHelperText,
} from "@mui/material";
import {
  FilterList,
  Search,
  Close,
  Add,
  Person,
  MenuBook,
} from "@mui/icons-material";
import useCourseList from "@/hooks/useCourseList";

import { api_url } from "@/hooks/apiurl";
import toast from "react-hot-toast";
import UserFilter from "./UserFilter";
import { useAllOrders } from "@/hooks/useAllOrders";

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
    courses: [
      {
        courseId: "",
      },
    ],
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

    if (formData.courses.length === 0 || !formData.courses[0].courseId) {
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
      console.log(error);
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

  const selectedCoursesCount = formData.courses.filter(
    (course: any) => course.courseId
  ).length;

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: "primary.main", color: "white" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <MenuBook sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Create Manual Order
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2 }}>
        {/* Customer Information */}
        <Box mb={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Person color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Customer Information
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <FormControl fullWidth margin="normal">
              <InputLabel>Select Customer</InputLabel>
              <UserFilter
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
              <FormHelperText>
                Search for existing users or fill out the form below for new
                customers
              </FormHelperText>
            </FormControl>

            {/* Manual user info form */}
            {!selectedUser && (
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Customer Details
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={manualUserInfo.name}
                    onChange={(e) =>
                      handleManualUserInfoChange("name", e.target.value)
                    }
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={manualUserInfo.email}
                    onChange={(e) =>
                      handleManualUserInfoChange("email", e.target.value)
                    }
                    required
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={manualUserInfo.phone}
                  onChange={(e) =>
                    handleManualUserInfoChange("phone", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
              </Box>
            )}

            {selectedUser && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Customer selected. Now add courses to their order.
              </Alert>
            )}
          </Paper>
        </Box>

        {/* Course Information */}
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <MenuBook color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Course Information
              </Typography>
              {selectedCoursesCount > 0 && (
                <Chip
                  label={`${selectedCoursesCount} course(s) selected`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />

            {/* Filters */}
            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
              mb={3}
              alignItems="flex-end"
            >
              <TextField
                size="small"
                placeholder="Search courses..."
                value={filters.searchText}
                onChange={(e) =>
                  handleFilterChange("searchText", e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 250 }}
              />

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="UPCOMING">Upcoming</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Basic Status</InputLabel>
                <Select
                  value={filters.basicStatus}
                  label="Basic Status"
                  onChange={(e) =>
                    handleFilterChange("basicStatus", e.target.value)
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="FREE">Free</MenuItem>
                  <MenuItem value="PAID">Paid</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={resetFilters}
                size="small"
              >
                Reset Filters
              </Button>
            </Box>

            {/* Course List */}
            <Box mb={2}>
              {(formData.courses || []).map((course: any, index: number) => (
                <Box
                  key={index}
                  mb={2}
                  p={2}
                  sx={{
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    backgroundColor:
                      index % 2 === 0 ? "transparent" : "grey.50",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="subtitle2" color="primary">
                      Course {index + 1}
                    </Typography>
                    {index > 0 && (
                      <IconButton
                        size="small"
                        onClick={() => removeCourse(index)}
                        color="error"
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Select Course</InputLabel>
                    <Select
                      value={course.courseId || ""}
                      label="Select Course"
                      onChange={(e) =>
                        handleCourseChange(index, "courseId", e.target.value)
                      }
                      disabled={courseLoading}
                      MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                    >
                      {courseLoading ? (
                        <MenuItem disabled>
                          <Box
                            display="flex"
                            justifyContent="center"
                            width="100%"
                          >
                            <CircularProgress size={20} />
                          </Box>
                        </MenuItem>
                      ) : (
                        courseData?.courses?.map((c: any) => (
                          <MenuItem key={c._id} value={c._id}>
                            <Box
                              display="flex"
                              alignItems="center"
                              width="100%"
                            >
                              <Avatar
                                src={c?.basicInfo?.thumbnail}
                                sx={{ width: 32, height: 32, mr: 2 }}
                                variant="rounded"
                              />
                              <Box>
                                <Typography variant="body2" noWrap>
                                  {c?.basicInfo?.title || "Untitled Course"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  ${c?.pricing?.amount || 0} •{" "}
                                  {c?.basicInfo?.level || "All levels"}
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Box>
              ))}
            </Box>

            <Button
              variant="outlined"
              onClick={addNewCourse}
              startIcon={<Add />}
              fullWidth
              sx={{ mt: 1 }}
            >
              Add Another Course
            </Button>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={submitting || selectedCoursesCount === 0}
          startIcon={submitting ? <CircularProgress size={16} /> : null}
        >
          {submitting ? "Creating Order..." : "Create Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrderModal;
