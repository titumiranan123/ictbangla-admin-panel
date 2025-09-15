import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useAllUserList } from "@/hooks/useAllUserList";

interface FilterState {
  page: number;
  perPage: number;
  userRole: string;
  search: string;
}

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email?: string;
}
interface props {
  setSelectedUser: (p: string) => void;
  selectedUser: string;
}

const UserFilter: React.FC<props> = ({ setSelectedUser, selectedUser }) => {
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    perPage: 10,
    userRole: "",
    search: "",
  });

  const { data, isLoading } = useAllUserList(filters);

  useEffect(() => {
    // setPage(0);
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [filters.perPage, filters.userRole, filters.search]);

  //   const handleChangeRowsPerPage = (
  //     event: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     setFilters((prev) => ({
  //       ...prev,
  //       perPage: parseInt(event.target.value, 10),
  //     }));
  //   };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, userRole: event.target.value }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: event.target.value }));
  };

  const clearSearch = () => {
    setFilters((prev) => ({ ...prev, search: "" }));
  };

  const handleUserSelect = (event: SelectChangeEvent<string>) => {
    setSelectedUser(event.target.value);
  };

  // const roleOptions = [
  //   { value: "", label: "All Roles" },
  //   { value: "ADMIN", label: "Admin" },
  //   { value: "USER", label: "User" },
  // ];

  return (
    <div>
      {/* Filters */}
      <Box className="mb-6 mt-5 flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* <TextField
          select
          label="Filter by Role"
          value={filters.userRole}
          onChange={handleRoleChange}
          className="w-full md:w-48"
          size="small"
        >
          {roleOptions.map((option) => (
            <MenuItem key={option?.value} value={option?.value}>
              {option?.label}
            </MenuItem>
          ))}
        </TextField> */}

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
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          placeholder="Search by name, email, etc."
        />
      </Box>

      {/* Users Dropdown */}
      <Box>
        {isLoading ? (
          <Box className="flex justify-center items-center my-6">
            <CircularProgress size={28} />
          </Box>
        ) : data?.users?.length > 0 ? (
          <FormControl fullWidth size="small" className="mb-4">
            <InputLabel id="select-user-label">Select a User</InputLabel>
            <Select
              labelId="select-user-label"
              value={selectedUser}
              onChange={handleUserSelect}
              label="Select a User"
              displayEmpty
            >
              {data?.users.map((user: User) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.first_name} {user.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography color="textSecondary" className="text-center mt-6">
            No users found.
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default UserFilter;
