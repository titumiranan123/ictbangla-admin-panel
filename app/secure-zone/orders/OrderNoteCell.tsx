'use client'
import { useState } from "react";

interface OrderNoteCellProps {
  order: any;
  onUpdate: (orderId: string, field: any, value: any) => void;
}

const OrderNoteCell = ({ order, onUpdate }: OrderNoteCellProps) => {
  const [note, setNote] = useState(order?.agenda?.note || "");


  const handleBlur = () => {
    if (note !== order?.agenda?.note) {
      onUpdate(order, "note", note);
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