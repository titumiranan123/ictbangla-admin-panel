// components/CouponCard.tsx

import { useState } from "react";
import toast from "react-hot-toast";

const CouponCard = ({
  coupon,
  onEdit,
  onDelete,
}: {
  coupon: any;
  onEdit: () => void;
  onDelete: (p: string) => void;
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const [copied, setCopied] = useState(false);
  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Coupon copied !");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{coupon?.title}</h3>
            <div className="mt-1 flex items-center">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded">
                {coupon?.coupon_code}
              </span>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">
                {coupon?.reduce_percent}% OFF
              </span>
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${
              coupon?.is_global
                ? "bg-purple-100 text-purple-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {coupon?.is_global ? "Global" : "Course Specific"}
          </span>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            <span className="font-medium">Valid:</span>{" "}
            {formatDate(coupon?.start_time)} - {formatDate(coupon?.end_time)}
          </p>
          {!coupon?.is_global && coupon?.course_id && (
            <p className="mt-1">
              <span className="font-medium">Course Name:</span>{" "}
              {coupon?.course_id?.basicInfo?.title}
            </p>
          )}
        </div>

        <div className="mt-4 flex space-x-3">
          <button
            onClick={() => onEdit()}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(coupon?._id)}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => handleCopy(coupon?.coupon_code)}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
