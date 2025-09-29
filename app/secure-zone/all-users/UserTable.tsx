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
import Swal from "sweetalert2";
import {
  IconButton,
  InputAdornment,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "lucide-react";
import UserAction from "./UserAction";

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

  // delete function
  const handleDelete = async (userId: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        // 👉 এখানে delete API call করো
        // await api.delete(`/users/${userId}`)

        refetch?.();

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "User has been deleted.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "_id",
      header: "User Id",
      cell: ({ row }) => (
        <div
          className="relative font-medium cursor-pointer group max-w-[120px]"
          onClick={() => handleToCopyText(row.original._id)}
        >
          {row.original?._id?.slice(10)}
          <span className="absolute inset-0 hidden px-2 py-1 text-green-500 bg-gray-200 backdrop-blur-2xl text-[12px] w-16 h-10 rounded opacity-0 group-hover:block group-hover:opacity-100 transition-opacity">
            Click to copy
          </span>
        </div>
      ),
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
            className="text-sm text-gray-500 break-words"
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
            className="text-sm text-gray-500"
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
    // state: { columnVisibility },
    // onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });
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

      <Table className="mt-4  h-full">
        <TableHeader className="sticky top-0 bg-white z-10">
          {table.getHeaderGroups().map((headerGrop) => (
            <TableRow key={headerGrop.id}>
              {headerGrop.headers.map((header) => (
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
    </div>
  );
};

export default UserTable;
