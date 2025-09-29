"use client";

import { api_url } from "@/hooks/apiurl";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Phone {
  number: string;
  is_verified: boolean;
  is_primary_number: boolean;
  _id?: string;
}

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  login_type: string;
  is_verified: boolean;
  is_approve: boolean;
  role: "USER" | "ADMIN";
  profile_image: string;
  phones: Phone[];
}

interface EditUserModalProps {
  user: User;
  open: boolean;
  onClose: (isOpen: boolean) => void;
  refetch: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  open,
  onClose,
  refetch,
}) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    role: "USER" as "USER" | "ADMIN",
    is_approve: false,
    is_verified: false,
    profile_image: "",
    phones: [] as Phone[],
  });

  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        user_name: user.user_name || "",
        email: user.email || "",
        role: user.role || "USER",
        is_approve: user.is_approve || false,
        is_verified: user.is_verified || false,
        profile_image: user.profile_image || "",
        phones: user.phones || [],
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhoneChange = (
    index: number,
    field: keyof Phone,
    value: string | boolean
  ) => {
    const updatedPhones = [...formData.phones];
    updatedPhones[index] = {
      ...updatedPhones[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      phones: updatedPhones,
    }));
  };

  const addPhone = () => {
    const newPhone: Phone = {
      number: "",
      is_verified: false,
      is_primary_number: false,
    };

    setFormData((prev) => ({
      ...prev,
      phones: [...prev.phones, newPhone],
    }));
  };

  const removePhone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index),
    }));
  };

  const setPrimaryPhone = (index: number) => {
    const updatedPhones = formData.phones.map((phone, i) => ({
      ...phone,
      is_primary_number: i === index,
    }));

    setFormData((prev) => ({
      ...prev,
      phones: updatedPhones,
    }));
  };

  const handleSave = async () => {
    if (
      !formData.first_name.trim() ||
      !formData.email.trim() ||
      !formData.user_name.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error!",
        text: "First name, username and email are required.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Validate phone numbers
    const invalidPhone = formData.phones.find((phone) => !phone.number.trim());
    if (invalidPhone) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error!",
        text: "Please fill all phone numbers or remove empty ones.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api_url.patch(
        `/v1/admin-user/update/user/${user._id}`,
        formData
      );

      if (res.status === 200 || res.status === 201) {
        refetch?.();
        onClose(false);

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "User info updated successfully.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error: any) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Update failed.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
        is_approve: user.is_approve,
        is_verified: user.is_verified,
        profile_image: user.profile_image,
        phones: user.phones,
      });
    }
    onClose(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Edit User</h2>

        <div className="space-y-3">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              placeholder="Username"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Approval Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_approve"
              checked={formData.is_approve}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Approved User
            </label>
          </div>

          {/* Verification Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_verified"
              checked={formData.is_verified}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Verified User
            </label>
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image URL
            </label>
            <input
              name="profile_image"
              value={formData.profile_image}
              onChange={handleChange}
              placeholder="Profile Image URL"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.profile_image && (
              <div className="mt-2">
                <img
                  src={formData.profile_image}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Phone Numbers */}
          <div className="border rounded p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Numbers
            </label>

            {formData.phones.length === 0 ? (
              <p className="text-sm text-gray-500 mb-2">
                No phone numbers added
              </p>
            ) : (
              formData.phones.map((phone, index) => (
                <div
                  key={phone._id || index}
                  className="border rounded p-3 mb-3 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Phone Number *
                      </label>
                      <input
                        value={phone.number}
                        onChange={(e) =>
                          handlePhoneChange(index, "number", e.target.value)
                        }
                        placeholder="+880XXXXXXXXXX"
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={phone.is_verified}
                          onChange={(e) =>
                            handlePhoneChange(
                              index,
                              "is_verified",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-xs text-gray-700">
                          Verified
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="primary_phone"
                          checked={phone.is_primary_number}
                          onChange={() => setPrimaryPhone(index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 block text-xs text-gray-700">
                          Primary
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      ID: {phone._id}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePhone(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}

            <button
              type="button"
              onClick={addPhone}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              + Add Phone Number
            </button>
          </div>

          {/* Read-only information */}
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Login Type:</strong> {user.login_type}
            </p>
            <p className="text-sm text-gray-600">
              <strong>User ID:</strong> {user._id}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
