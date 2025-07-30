import useCourseList from "@/hooks/useCourseList";
import { Close, FilterList, Search } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const SelectCourse = ({
  formData,
  setFormData,
}: {
  setFormData: (prev: any) => void;
  formData: any;
}) => {
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

  const handleCourseChange = (index: number, field: string, value: any) => {
    const updatedCourses = [...(formData.courses || [])];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    handleChange("courses", updatedCourses);
  };

  // const addNewCourse = () => {
  //   handleChange("courses", [
  //     ...(formData.courses || []),
  //     {
  //       courseId: "",
  //     },
  //   ]);
  // };
  const removeCourse = (index: number) => {
    const updatedCourses = [...(formData.courses || [])];
    updatedCourses.splice(index, 1);
    handleChange("courses", updatedCourses);
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
  return (
    <div>
      <div className="">
        <Paper elevation={0}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Course Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Filters */}
          <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
            <TextField
              size="small"
              placeholder="Search courses..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange("searchText", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.disabled" }} />
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
                <MenuItem value="PAID">Paid</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={resetFilters}
            >
              Reset
            </Button>
          </Box>

          {/* Course List */}
          {(formData.courses || []).map((course: any, index: number) => (
            <Box
              key={index}
              mb={3}
              p={2}
              sx={{ border: "1px dashed #ddd", borderRadius: 1 }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="subtitle2">Course {index + 1}</Typography>
                {index > 0 && (
                  <IconButton size="small" onClick={() => removeCourse(index)}>
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
                >
                  {courseLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    courseData?.courses?.map((c: any) => (
                      <MenuItem key={c._id} value={c._id}>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={c?.basicInfo?.thumbnail}
                            sx={{ width: 24, height: 24, mr: 1 }}
                          />
                          {c?.basicInfo?.title || "Untitled"} - $
                          {c?.pricing?.amount || 0}
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Box>
          ))}

          {/* <Button
            variant="outlined"
            onClick={addNewCourse}
            fullWidth
            sx={{ mt: 1 }}
          >
            Add Another Course
          </Button> */}
        </Paper>
      </div>
    </div>
  );
};

export default SelectCourse;
