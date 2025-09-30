"use client";
import React, { useEffect, useState } from "react";

import { useAllUserList } from "@/hooks/useAllUserList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { handleToCopyText } from "@/utils/handleCopy";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonRow } from "../orders/(mjorcomp)/SkeletonRow";
import {
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Alert,
} from "@mui/material";
import UserAction from "./UserAction";
import { CustomPagination } from "@/utils/CustomPagination";
import { api_url } from "@/hooks/apiurl";
import Swal from "sweetalert2";

// Custom Modal Component
interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => Promise<void>;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",

    email: "",
    phone: "",
    password: "",

    role: "USER",
    bio: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        login_type: "EMAIL",
        is_verified: false,
        is_approve: false,
      });
      handleClose();
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",

      role: "USER",
      bio: "",
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="h2" className="font-bold">
          Create New User
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box className="space-y-4 mt-2">
          {/* Name Row */}
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="First Name *"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              error={!!errors.first_name}
              helperText={errors.first_name}
              fullWidth
              size="small"
            />
            <TextField
              label="Last Name *"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              error={!!errors.last_name}
              helperText={errors.last_name}
              fullWidth
              size="small"
            />
          </Box>

          {/* Username and Email */}
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              size="small"
            />
          </Box>

          {/* Phone and Password */}
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Phone "
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth
              size="small"
            />
            <TextField
              label="Password "
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              size="small"
            />
          </Box>

          {/* Role */}
          <TextField
            select
            label="Role *"
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </TextField>

          {/* Bio */}
          <TextField
            label="Bio"
            multiline
            rows={3}
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            fullWidth
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions className="p-4">
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Success/Error Notification Component
interface NotificationProps {
  open: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  open,
  type,
  message,
  onClose,
}) => {
  if (!open) return null;

  return (
    <Box className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert severity={type} onClose={onClose} variant="filled">
        {message}
      </Alert>
    </Box>
  );
};

const UserTable = () => {
  const [filters, setFilters] = useState({
    page: 1,
    perPage: 10,
    userRole: "",
    search: "",
  });

  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  // Reset page when filters change or on initial load
  useEffect(() => {
    setPage(page);
  }, [filters.perPage, filters.userRole, filters.search, page]);

  const { data, isLoading, refetch } = useAllUserList({
    ...filters,
    page: page,
  });

  const handleCreateUser = async (userData: any) => {
    try {
      // Simulate API call
      const res = await api_url.post("/v1/admin-user/create/new-user", {
        ...userData,
      });
      if (res.status === 201 || res.status === 200) {
        Swal.fire("success", "User created successfully");
        refetch();
      }
    } catch (error) {
      Swal.fire("error", "Failed to create user. Please try again.");
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setFilters((prev) => ({ ...prev, perPage: newRowsPerPage }));
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, userRole: event.target.value }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: event.target.value }));
  };

  const clearSearch = () => {
    setFilters((prev) => ({ ...prev, search: "" }));
  };

  // Role options
  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "User" },
  ];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "_id",
      header: "User Id",
      cell: ({ row }) => {
        return (
          <div
            className="relative font-medium cursor-pointer group max-w-[120px]"
            onClick={() => handleToCopyText(row.original._id)}
          >
            {row.original?._id?.slice(10)}
            <span className="absolute inset-0 hidden px-2 py-1 text-green-500 bg-gray-200 backdrop-blur-2xl text-[12px] w-16 h-10 rounded opacity-0 group-hover:block group-hover:opacity-100 transition-opacity">
              Click to copy
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium">
            {row.original.first_name} {row.original.last_name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email ",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div
            onClick={() => handleToCopyText(row.original.email)}
            className="text-sm text-gray-500 break-words cursor-pointer"
          >
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone ",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div
            onClick={() => handleToCopyText(row.original.phones?.[0]?.number)}
            className="text-sm text-gray-500 cursor-pointer"
          >
            {row.original.phones?.[0]?.number
              ? row.original.phones?.[0]?.number
              : "N/A"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "Action",
      header: "Action",
      size: 100,
      cell: ({ row }) => <UserAction data={row.original} refetch={refetch} />,
    },
  ];

  const table = useReactTable({
    data: data?.users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      {/* Notification */}
      <Notification
        open={notification.open}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      />

      {/* Create User Modal */}
      <CreateUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <Typography variant="h5" className="font-bold text-gray-800">
          {isLoading ? (
            <Skeleton variant="text" width={150} />
          ) : (
            `Users (${data?.totalUsers || 0})`
          )}
        </Typography>

        <Button
          variant="contained"
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create User
        </Button>
      </div>

      {/* Enhanced Filter Controls */}
      <div className="mb-6 mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Typography variant="h6" className="mb-3 font-semibold text-gray-700">
          Filter Users
        </Typography>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <TextField
              select
              label="Filter by Role"
              value={filters.userRole}
              onChange={handleRoleChange}
              className="w-full sm:w-48"
              size="small"
              variant="outlined"
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Items per page"
              type="number"
              value={filters.perPage}
              onChange={handleChangeRowsPerPage}
              className="w-full sm:w-32"
              size="small"
              variant="outlined"
              inputProps={{ min: 1, max: 100 }}
            />
          </div>

          <div className="flex-1 w-full md:max-w-md">
            <TextField
              label="Search Users"
              variant="outlined"
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: filters.search && (
                  <IconButton
                    onClick={clearSearch}
                    size="small"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ),
              }}
              placeholder="Search by name, email, phone, etc."
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.userRole || filters.search) && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <Typography variant="body2" className="text-gray-600 font-medium">
              Active filters:
            </Typography>

            {filters.userRole && (
              <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                <span>
                  Role:{" "}
                  {roleOptions.find((r) => r.value === filters.userRole)?.label}
                </span>
                <IconButton
                  size="small"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, userRole: "" }))
                  }
                  className="!p-0 !ml-1 !w-4 !h-4"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </div>
            )}

            {filters.search && (
              <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                <span>Search: "{filters.search}"</span>
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  className="!p-0 !ml-1 !w-4 !h-4"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </div>
            )}
          </div>
        )}
      </div>

      <Table className="mt-4 h-full">
        <TableHeader className="sticky top-0 bg-white z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array(5) // number of skeleton rows
                .fill(0)
                .map((_, idx) => <SkeletonRow key={idx} />)
            : table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <CustomPagination
        page={page}
        setPage={setPage}
        totalPage={Math.ceil(data?.totalPages)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserTable;
