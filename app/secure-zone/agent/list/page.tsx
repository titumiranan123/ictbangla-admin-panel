"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TablePagination,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { useAllAgent } from "@/hooks/useAllAgent";
import Link from "next/link";
import { api_url } from "@/hooks/apiurl";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  is_active: boolean;
  createdAt: string;
}

interface EditFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
}

interface FilterOptions {
  is_active?: boolean;
  orderBy?: "FROM_OLD" | "FROM_NEW";
  searchText?: string;
}

const UserTable: React.FC = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    is_active: true,
    orderBy: "FROM_OLD",
    searchText: "",
  });

  const { data: initialData, refetch } = useAllAgent(filterOptions);
  console.log(initialData)
  const [users, setUsers] = useState<User[]>(initialData || []);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: "",
    email: "",
    phone: "",
    position: "",
  });
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Update users when initialData changes
  useEffect(() => {
    setUsers(initialData || []);
  }, [initialData]);

  // Refetch data when filter options change
  useEffect(() => {
    refetch();
  }, [filterOptions, refetch]);

  const handleEditClick = (user: User): void => {
    setCurrentUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      position: user.position,
    });
    setOpenEditDialog(true);
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditSubmit = (): void => {
    if (!currentUser) return;

    const updatedUsers = users.map((user) =>
      user._id === currentUser._id ? { ...user, ...editFormData } : user
    );
    setUsers(updatedUsers);
    setOpenEditDialog(false);
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "The user has been updated successfully.",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleDeleteClick = async (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await api_url.delete(`/v1/admin-user/call-agent/${userId}`);
        if (res.status === 200 || res.status === 201)
          refetch()
          Swal.fire("Deleted!", "The user has been deleted.", "success");
      }
    });
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any): void => {
    setFilterOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(0); // Reset to first page when filters change
  };

  const handleCreateAgent = (): void => {
    // Implement your create agent logic here
    // This could open a create dialog or navigate to a create page
    console.log("Create agent clicked");
  };

  // Avoid a layout jump when reaching the last page with empty rows
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Agent Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/secure-zone/agent/create"
        >
          Create Agent
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search agents..."
          value={filterOptions.searchText}
          onChange={(e) => handleFilterChange("searchText", e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterOptions.is_active ? "active" : "inactive"}
            label="Status"
            onChange={(e) =>
              handleFilterChange("is_active", e.target.value === "active")
            }
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filterOptions.orderBy}
            label="Sort By"
            onChange={(e) => handleFilterChange("orderBy", e.target.value)}
          >
            <MenuItem value="FROM_OLD">Oldest First</MenuItem>
            <MenuItem value="FROM_NEW">Newest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? users.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : users
            ).map((user) => (
              <TableRow
                key={user._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.position}</TableCell>
                <TableCell>
                  {user.is_active ? (
                    <Box component="span" sx={{ color: "green" }}>
                      Active
                    </Box>
                  ) : (
                    <Box component="span" sx={{ color: "red" }}>
                      Inactive
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEditClick(user)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDeleteClick(user._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Name"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={editFormData.email}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone"
              name="phone"
              value={editFormData.phone}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Position"
              name="position"
              value={editFormData.position}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTable;
