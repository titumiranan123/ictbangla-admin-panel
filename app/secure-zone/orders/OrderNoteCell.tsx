"use client";
import { api_url } from "@/hooks/apiurl";

interface OrderNoteCellProps {
  order: any;
  refetch: () => void;
}

const OrderNoteCell = ({ order, refetch }: OrderNoteCellProps) => {
  const handleBlur = async (value: string) => {
    try {
      const response = await api_url.patch(
        `/v1/admin-user/add-agenda-on-purchase/${order._id}`,
        { note: value }
      );

      if (response.status === 200 || response.status === 201) {
        refetch();
      }
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  return (
    <textarea
      defaultValue={order?.agenda?.note ?? ""}
      onBlur={(e) => {
        console.log(e);
        handleBlur(e.target.value);
      }}
      placeholder="Add note"
      className="w-[200px] p-1 border rounded text-sm min-h-[40px]"
      rows={2}
    />
  );
};

export default OrderNoteCell;
