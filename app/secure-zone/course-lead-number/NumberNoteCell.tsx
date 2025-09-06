"use client";

import { api_url } from "@/hooks/apiurl";
import { useState } from "react";

interface OrderNoteCellProps {
  order: any;
  refetch?: () => void; // optional refetch if you want to refresh after update
}

const NumberNoteCell = ({ order, refetch }: OrderNoteCellProps) => {
  const [note, setNote] = useState(order?.note || "");
  const [loading, setLoading] = useState(false);

  const handleBlur = async () => {
    if (note !== order?.note) {
      try {
        setLoading(true);
        const response = await api_url.patch(
          `/v1/admin-user/update-number-lead/${order._id}`,
          { note }
        );

        if (response.status === 200 || response.status === 201) {
          refetch?.(); // refresh data if refetch is provided
        }
      } catch (error) {
        console.error("Failed to update note:", error);
      } finally {
        setLoading(false);
      }
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
      disabled={loading}
    />
  );
};

export default NumberNoteCell;
