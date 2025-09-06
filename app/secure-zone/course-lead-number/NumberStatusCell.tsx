"use client";

import { api_url } from "@/hooks/apiurl";

interface OrderStatusCellProps {
  order: any;
  refetch?: () => void; // optional, to refresh after update
}

const NumberStatusCell = ({ order, refetch }: OrderStatusCellProps) => {
  const handleChange = async (value: string) => {
    try {
      const response = await api_url.patch(
        `/v1/admin-user/update-number-lead/${order._id}`,
        { call_status: value }
      );

      if (response.status === 200 || response.status === 201) {
        refetch?.(); // refresh data if refetch is provided
      }
    } catch (error) {
      console.error("Failed to update call status:", error);
    }
  };

  return (
    <select
      value={order?.call_status || "Not Called Yet"}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full p-1 border rounded text-sm"
    >
      <option value="Not Called Yet" disabled>
        Not Called Yet
      </option>
      <option value="Ok">Ok</option>
      <option value="OFF">Off</option>
      <option value="REJECT">Reject</option>
    </select>
  );
};

export default NumberStatusCell;
