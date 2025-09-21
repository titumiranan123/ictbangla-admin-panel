"use client";
import { useCouponDetails } from "@/hooks/useCouponDetails";
import React, { useState } from "react";
import PurchaseTable from "./CouponUsertable";

type Props = {
  courseId: string;
  userId?: string;
};

const CouponDetails = ({ courseId, userId }: Props) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filterParams, setFilterParams] = useState({
    startDate: "",
    endDate: "",
  });

  const { data, isLoading, refetch } = useCouponDetails(courseId, {
    page: 1,
    perPage: 10,
    orderBy: "FROM_OLD",
    userId,
    startDate: filterParams.startDate,
    endDate: filterParams.endDate,
  });

  const handleFilter = () => {
    setFilterParams({ startDate, endDate });
    refetch();
  };

  if (isLoading) {
    return <div>Loading coupon details...</div>;
  }

  if (!data) {
    return <div>No coupon details found.</div>;
  }

  return (
    <div className="p-6 bg-white shadow rounded-md space-y-4">
      {/* Filter Inputs */}
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filter
        </button>
      </div>

      {/* Table */}
      <PurchaseTable data={data?.usedCoupon} key={courseId} />
    </div>
  );
};

export default CouponDetails;
