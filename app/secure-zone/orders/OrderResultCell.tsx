"use client";
import { api_url } from "@/hooks/apiurl";
import {
  CheckCircleOutline,
  PendingOutlined,
  CancelOutlined,
} from "@mui/icons-material";

interface OrderResultCellProps {
  order: any;
  refetch: () => void;
}

const OrderResultCell = ({ order, refetch }: OrderResultCellProps) => {
  const currentResult =
    order?.agenda?.result && typeof order.agenda.result === "string"
      ? order.agenda.result.toLowerCase()
      : undefined;

  const onUpdate = async (value: string) => {
    try {
      const response = await api_url.patch(
        `/v1/admin-user/add-agenda-on-purchase/${order._id}`,
        { result: value }
      );
      if (response.status === 200 || response.status === 201) {
        if (value === "true" || value === "false" || value === "PENDING") {
          await api_url.post(
            `/v1/admin-user/manual-admin-payment/${
              order?.paymentId?._id
            }?paymentStatus=${value === "true" ? "PAID" : "UNPAID"}`
          );
        }
        refetch();
      }
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };
  return (
    <div className="flex  items-center">
      <button
        disabled={currentResult === "true"}
        onClick={() => onUpdate("true")}
        className={`p-1  rounded ${
          currentResult === "true"
            ? "text-green-500"
            : "text-gray-400 hover:text-green-300"
        }`}
        title="Mark as successful"
      >
        <CheckCircleOutline fontSize="small" />
      </button>
      <button
        onClick={() => onUpdate("PENDING")}
        className={`p-1 rounded ${
          currentResult === "pending"
            ? "text-amber-500"
            : "text-gray-400 hover:text-amber-300"
        }`}
        title="Mark as pending"
      >
        <PendingOutlined fontSize="small" />
      </button>
      <button
        onClick={() => onUpdate("false")}
        className={`p-1 rounded ${
          currentResult === "false"
            ? "text-red-500"
            : "text-gray-400 hover:text-red-300"
        }`}
        title="Mark as failed"
      >
        <CancelOutlined fontSize="small" />
      </button>

      {/* {currentResult !== undefined && (
        <span className="text-xs ml-1">
          {currentResult === "true"
            ? "Success"
            : currentResult === "pending"
            ? "Pending"
            : "Failed"}
        </span>
      )} */}
    </div>
  );
};

export default OrderResultCell;
