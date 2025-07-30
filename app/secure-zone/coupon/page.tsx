"use client";
// pages/CouponList.tsx
import { useState } from "react";
import CouponForm from "./Couponfrom";
import CouponCard from "./CouponCard";
import { useCouponList } from "../../../hooks/useCouponList";
import Swal from "sweetalert2";
import { api_url } from "@/hooks/apiurl";
import toast from "react-hot-toast";

interface Coupon {
  title: string;
  is_global: boolean;
  start_time: string;
  end_time: string;
  reduce_percent: number;
  coupon_code: string;
  course_id?: string;
}

const CouponList = () => {
  const { data, isLoading, refetch } = useCouponList();
  console.log(data?.coupons);

  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const handleAddCoupon = async (newCoupon: Coupon) => {
    console.log("Attempting to add coupon:", newCoupon);

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, create it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const response = await api_url.post(
          "/v1/admin-user/create/coupon",
          newCoupon
        );
        console.log("Coupon creation response:", response);

        if (response.status === 201) {
          setShowForm(false);
          refetch();
          await Swal.fire({
            title: "Created!",
            text: "Your coupon has been successfully created.",
            icon: "success",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        await Swal.fire({
          title: "Cancelled",
          text: "Coupon creation was cancelled.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      await Swal.fire({
        title: "Error!",
        text: "Failed to create coupon. Please try again.",
        icon: "error",
      });
    }
  };

  const handleUpdateCoupon = (updatedCoupon: Coupon) => {
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (couponCode: string) => {};

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Coupon Management
          </h1>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setShowForm(true);
            }}
            className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium"
          >
            Create New Coupon
          </button>
        </div>

        {showForm || editingCoupon ? (
          <CouponForm
            onSubmit={editingCoupon ? handleUpdateCoupon : handleAddCoupon}
            initialData={editingCoupon || undefined}
            isEditing={!!editingCoupon}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.coupons?.map((coupon: any) => (
              <CouponCard
                key={coupon._id}
                coupon={coupon}
                onEdit={() => {
                  setEditingCoupon(coupon);
                  setShowForm(true);
                }}
                onDelete={() => handleDeleteCoupon(coupon._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponList;
