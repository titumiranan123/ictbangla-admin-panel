"use client";

import { useCouponDetails } from "@/hooks/useCouponDetails";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const CouponDetails = async ({ params }: Props) => {
  const courseId = (await params).id;
  const { data, isLoading, error } = useCouponDetails(courseId);
  console.log("couponn data ", data);
  if (isLoading) {
    return <div>Loading coupon details...</div>;
  }

  if (error) {
    return <div>Failed to load coupon details.</div>;
  }

  if (!data) {
    return <div>No coupon details found.</div>;
  }

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-4">Coupon Details</h2>
      <p>
        <strong>Title:</strong> {data.title}
      </p>
      <p>
        <strong>Coupon Code:</strong> {data.coupon_code}
      </p>
      <p>
        <strong>Discount:</strong> {data.reduce_percent}%
      </p>
      <p>
        <strong>Type:</strong> {data.coupon_type}
      </p>
      <p>
        <strong>Start:</strong> {new Date(data.start_time).toLocaleString()}
      </p>
      <p>
        <strong>End:</strong> {new Date(data.end_time).toLocaleString()}
      </p>
      {data.course_ids && (
        <p>
          <strong>Course IDs:</strong> {data.course_ids}
        </p>
      )}
      {data.user_id && (
        <p>
          <strong>User ID:</strong> {data.user_id}
        </p>
      )}
    </div>
  );
};

export default CouponDetails;
