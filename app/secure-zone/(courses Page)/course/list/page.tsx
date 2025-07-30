"use client";
import useCourseList from "@/hooks/useCourseList";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Typography,
  TablePagination,
  Box,
  Skeleton,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search,
  FilterList,
  Refresh,
  Edit,
  Visibility,
  Delete,
  MoreVert,
} from "@mui/icons-material";
import Image from "next/image";

interface Course {
  _id: string;
  basicInfo: {
    title: string;
    slug: string;
    creator: {
      _id: string;
      first_name: string;
      last_name: string;
    };
    status?: string;
  };
  pricing: {
    isFree: boolean;
    price: {
      main: number;
      isDiscount: boolean;
      discount: number;
      percentage: number | null;
    };
    expiry: {
      status: boolean;
      date: string | null;
    };
  };
  media: {
    thumbnail: string;
  };
  status: string;
  ratings: Array<{
    _id: string;
    courseId: string;
    rating: number;
  }>;
  sections: Array<{
    _id: string;
    title: string;
    slug: string;
    courseId: string;
    lessons: Array<{
      _id: string;
      sectionId: string;
      title: string;
      duration: number;
      isFree: boolean;
    }>;
  }>;
}

interface Filters {
  page: number;
  perPage: number;
  orderBy: string;
  searchText: string;
  basicStatus: string;
  status: string;
}

const CourseList = () => {
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    perPage: 10,
    orderBy: "createdAt",
    searchText: "",
    basicStatus: "",
    status: "",
  });

  const { data, isLoading, isError, refetch } = useCourseList(filters);

  const handleChangePage = (event: unknown, newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters({
      ...filters,
      perPage: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters({ ...filters, [field]: value, page: 0 });
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      perPage: 10,
      orderBy: "createdAt_desc",
      searchText: "",
      basicStatus: "",
      status: "",
    });
  };

  const calculateTotalDuration = (course: Course) => {
    return course.sections.reduce((total, section) => {
      return (
        total +
        section.lessons.reduce((sectionTotal, lesson) => {
          return sectionTotal + (lesson.duration || 0);
        }, 0)
      );
    }, 0);
  };

  const countFreeLessons = (course: Course) => {
    return course.sections.reduce((total, section) => {
      return total + section.lessons.filter((lesson) => lesson.isFree).length;
    }, 0);
  };

  const getPriceDisplay = (course: Course) => {
    if (course.pricing.isFree)
      return (
        <Typography variant="body2" color="success.main" fontWeight="bold">
          Free
        </Typography>
      );

    const { main, isDiscount, discount, percentage } = course.pricing.price;

    if (isDiscount) {
      return (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            Discount Price: Tk {(main - discount).toFixed(2)}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textDecoration: "line-through" }}
          >
            Tk {main.toFixed(2)}
          </Typography>

          <Typography variant="caption" color="error.main" sx={{ ml: 1 }}>
            {discount}Tk off
          </Typography>
        </Box>
      );
    } else {
      const discountedPrice = main - (main * (percentage || 0)) / 100;
      return (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            Dis. price: Tk {discountedPrice.toFixed(2)}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textDecoration: "line-through" }}
          >
            Tk {main.toFixed(2)}
          </Typography>
          {percentage && (
            <Typography variant="caption" color="error.main" sx={{ ml: 1 }}>
              {percentage}% off
            </Typography>
          )}
        </Box>
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "success";
      case "UPCOMING":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">
          Courses ({data?.totalCourses || 0})
        </Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={() => refetch()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filter Section */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search courses..."
          value={filters.searchText}
          onChange={(e) => handleFilterChange("searchText", e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.disabled" }} />,
          }}
          sx={{ width: 300 }}
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
            onChange={(e) => handleFilterChange("basicStatus", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="FREE">Free</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.orderBy}
            label="Sort By"
            onChange={(e) => handleFilterChange("orderBy", e.target.value)}
          >
            <MenuItem value="createdAt_desc">Newest First</MenuItem>
            <MenuItem value="createdAt_asc">Oldest First</MenuItem>
            <MenuItem value="title_asc">Title (A-Z)</MenuItem>
            <MenuItem value="title_desc">Title (Z-A)</MenuItem>
            <MenuItem value="price_asc">Price (Low to High)</MenuItem>
            <MenuItem value="price_desc">Price (High to Low)</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Course</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Instructor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Free Lessons</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sections</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: filters.perPage }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width={150} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={60} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={60} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={60} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={120} />
                    </TableCell>
                  </TableRow>
                ))
              : data?.courses.map((course: Course) => (
                  <TableRow key={course._id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Image
                          src={course.media.thumbnail}
                          alt={course.basicInfo.title}
                          width={56}
                          height={56}
                        />
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {course.basicInfo.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {course.basicInfo.slug}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {course.basicInfo.creator.first_name}{" "}
                      {course.basicInfo.creator.last_name}
                    </TableCell>
                    <TableCell>{getPriceDisplay(course)}</TableCell>
                    <TableCell>
                      {Math.round(calculateTotalDuration(course) / 60)} hrs
                    </TableCell>
                    <TableCell>{countFreeLessons(course)}</TableCell>
                    <TableCell>{course.sections.length}</TableCell>
                    <TableCell>
                      <Chip
                        label={course.status}
                        color={getStatusColor(course.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View">
                          <IconButton size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More">
                          <IconButton size="small">
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.totalCourses || 0}
        rowsPerPage={filters.perPage}
        page={filters.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default CourseList;
