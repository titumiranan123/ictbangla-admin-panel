"use client";
import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import EditUserModal from "./EditUserModal";
import Swal from "sweetalert2";
import { api_url } from "@/hooks/apiurl";

interface UserActionProps {
  data: any;
  refetch: () => void;
}

const UserAction: React.FC<UserActionProps> = ({ data, refetch }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Delete function
  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await api_url.patch(`/v1/admin-user/delete/user/${userId}`);

        if (res.status === 200 || res.status === 201) {
          refetch();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User has been deleted successfully.",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete user. Please try again.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Edit Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-600 transition"
      >
        <Pencil className="h-4 w-4" />
        Edit
      </button>

      {/* Delete Button */}
      <button
        onClick={() => handleDelete(data?._id)}
        className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-red-600 transition"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>

      {/* Edit Modal */}
      {isOpen && (
        <EditUserModal
          onClose={setIsOpen}
          open={isOpen}
          refetch={refetch}
          user={data}
        />
      )}
    </div>
  );
};

export default UserAction;
