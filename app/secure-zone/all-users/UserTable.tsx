"use client";
import React, { useEffect, useState } from "react";
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
  Skeleton,
  TextField,
  MenuItem,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useAllUserList } from "@/hooks/useAllUserList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const UserTable = () => {
  const [filters, setFilters] = useState({
    page: 1,
    perPage: 10,
    userRole: "",
    search: "",
  });
  const { data, isLoading, refetch } = useAllUserList(filters);
  const [page, setPage] = useState(0);

  // Reset page when filters change or on initial load
  useEffect(() => {
    setPage(0);
  }, [filters.perPage, filters.userRole, filters.search]);

  // Handle page changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage + 1 }));
    window.scrollTo(0, 0);
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
  // Skeleton loader rows
  const skeletonRows = Array(filters.perPage).fill(0);

  return (
    <div className="p-4">
      <Typography variant="h5" className="mb-4 font-bold text-gray-800">
        {isLoading ? (
          <Skeleton variant="text" width={150} />
        ) : (
          `Users (${data?.totalUsers || 0})`
        )}
      </Typography>

      {/* Filter Controls */}
      <Box className="mb-4 mt-10 flex flex-col md:flex-row gap-4">
        <TextField
          select
          label="Filter by Role"
          value={filters.userRole}
          onChange={handleRoleChange}
          className="w-full md:w-48"
          size="small"
        >
          {roleOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Search Users"
          variant="outlined"
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full md:w-64"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: filters.search && (
              <IconButton onClick={clearSearch} size="small">
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
          placeholder="Search by name, email, etc."
        />
      </Box>

      <TableContainer component={Paper} className="shadow-md rounded-lg mt-10">
        <Table className="min-w-full">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold">User</TableCell>
              <TableCell className="font-semibold">Username</TableCell>
              <TableCell className="font-semibold">Email</TableCell>
              <TableCell className="font-semibold">Login Type</TableCell>
              <TableCell className="font-semibold">Status</TableCell>
              <TableCell className="font-semibold">Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? skeletonRows.map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Skeleton variant="circular" width={40} height={40} />
                        <div className="flex-1">
                          <Skeleton variant="text" width="80%" />
                          <Skeleton variant="text" width="60%" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={80} height={24} />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={24}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={24}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                  </TableRow>
                ))
              : data?.users?.map((user: any) => (
                  <TableRow key={user._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {user.profile_image ? (
                          <Avatar
                            src={user.profile_image}
                            alt={`${user.first_name} ${user.last_name}`}
                          />
                        ) : (
                          <Avatar>
                            {user.first_name?.[0]}
                            {user.last_name?.[0]}
                          </Avatar>
                        )}
                        <div>
                          <p className="font-medium">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.user_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.login_type}
                        size="small"
                        className={
                          user.login_type === "GOOGLE"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Chip
                          label={user.is_verified ? "Verified" : "Unverified"}
                          size="small"
                          color={user.is_verified ? "success" : "default"}
                        />
                        <Chip
                          label={user.is_approve ? "Approved" : "Pending"}
                          size="small"
                          color={user.is_approve ? "success" : "warning"}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.phone?.length > 0 ? (
                        <div>
                          <p>{user.phone[0].number}</p>
                          {user.phone[0].is_primary_number && (
                            <span className="text-xs text-green-600">
                              Primary
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!isLoading && (
        <TablePagination
          component="div"
          count={data?.totalUsers || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={filters.perPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="mt-4"
          rowsPerPageOptions={[5, 10, 25]}
        />
      )}
    </div>
  );
};

export default UserTable;
