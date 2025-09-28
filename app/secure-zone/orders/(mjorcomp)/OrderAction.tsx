"use client";

import React from "react";
import Swal from "sweetalert2";
import { Link as LucideLink } from "lucide-react";
import { api_url } from "@/hooks/apiurl";
import { handleToCopyText } from "@/utils/handleCopy";

interface OrderActionProps {
  data: {
    order_uuid?: string;
    paymentId?: {
      _id?: string;
    };
  };
  refetch: () => void;
}

const OrderAction: React.FC<OrderActionProps> = ({ data, refetch }) => {
  const handleRefund = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Refund Request",
      html: `
        <input id="swal-input-sku" class="swal2-input" placeholder="Enter SKU name">
        <textarea id="swal-input-reason" class="swal2-textarea" placeholder="Type your reason here..."></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Refund",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const sku = (
          document.getElementById("swal-input-sku") as HTMLInputElement
        )?.value;
        const reason = (
          document.getElementById("swal-input-reason") as HTMLTextAreaElement
        )?.value;

        if (!sku) {
          Swal.showValidationMessage("SKU name is required");
          return false;
        }
        if (!reason) {
          Swal.showValidationMessage("Refund reason is required");
          return false;
        }

        return { sku, reason };
      },
    });

    if (formValues.reason && formValues.sku) {
      try {
        const response = await api_url.post(
          `/v1/admin-user/refund-payment/${data?.paymentId?._id}`,
          { sku: formValues.sku, reason: formValues.reason }
        );

        if (response.status === 200 || response.status === 201) {
          refetch();
          Swal.fire(
            "Refunded!",
            "The order has been refunded successfully.",
            "success"
          );
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong while refunding.", "error");
      }
    }
  };

  return (
    <div className="flex gap-2 w-[200px]">
      {/* Payment Button */}
      <button
        onClick={() =>
          handleToCopyText(
            `https://ictbangla.com/checkout/payment?orderId=${data?.order_uuid}`
          )
        }
        className="p-1 bg-red-500 hover:bg-red-700 rounded-lg text-white px-3 flex justify-center items-center transition-colors"
      >
        Copy Pay Url
      </button>

      {/* Refund Button */}
      <button
        onClick={handleRefund}
        className="p-1 bg-blue-500 hover:bg-blue-700 rounded-lg text-white px-3 flex justify-center items-center transition-colors"
      >
        Refund
      </button>
    </div>
  );
};

export default OrderAction;
