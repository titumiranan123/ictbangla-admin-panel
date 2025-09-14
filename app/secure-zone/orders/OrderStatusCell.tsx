"use client";
import { api_url } from "@/hooks/apiurl";

interface OrderStatusCellProps {
  order: any;
  refetch: () => void;
}

const OrderStatusCell = ({ order, refetch }: OrderStatusCellProps) => {
  const onUpdate = async (value: any) => {
    const response = await api_url.patch(
      `/v1/admin-user/add-agenda-on-purchase/${order._id}`,
      {
        call_status: value,
      }
    );
    if (response.status === 201 || response.status === 200) {
      refetch();
      console.log("response", response);
    }
  };
  return (
    <select
      value={order?.agenda?.call_status || "Not Called Yet"}
      onChange={(e) => onUpdate(e.target.value)}
      className="w-[120px] p-1 border rounded text-sm"
    >
      <option value="Not Called Yet" title="Not Called Yet">
        Not Called Yet
      </option>
      <option value="Ok">Ok</option>
      <option value="Off">Off</option>
      <option value="N/r">N/r</option>
    </select>
  );
};

export default OrderStatusCell;
