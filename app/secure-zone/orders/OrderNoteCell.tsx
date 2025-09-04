"use client";
import { api_url } from "@/hooks/apiurl";
import { useState } from "react";

interface OrderNoteCellProps {
  order: any;
  onUpdate: (orderId: string, field: any, value: any) => void;
}

const OrderNoteCell = ({ order }: OrderNoteCellProps) => {
  const [note, setNote] = useState(order?.agenda?.note || "");

  const handleBlur = async () => {
    if (note !== order?.agenda?.note) {
      console.log("order update", order);
      const response = await api_url.patch(
        `/v1/admin-user/add-agenda-on-purchase/${order._id}`,
        {
          note: note,
        }
      );
      console.log("note", response);
    }
  };

  return (
    <textarea
      value={note}
      onChange={(e) => setNote(e.target.value)}
      onBlur={handleBlur}
      placeholder="Add note"
      className="w-full p-1 border rounded text-sm min-h-[40px]"
      rows={2}
    />
  );
};

export default OrderNoteCell;
