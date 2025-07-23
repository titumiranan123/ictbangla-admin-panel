'use client'
import { Order } from "./types";


interface OrderStatusCellProps {
  order: any;
  onUpdate: (orderId: string, field: keyof Order, value: any) => void;
}

const OrderStatusCell = ({ order, onUpdate }: OrderStatusCellProps) => {
  return (
    <select
      value={order?.agenda?.call_status || "Not Called Yet"}
      onChange={(e) =>
        onUpdate(order, "call_status", e.target.value )
      }
      className="w-full p-1 border rounded text-sm"
    >
      <option value="Not Called Yet">Not Called Yet</option>
      <option value="Ok">Ok</option>
      <option value="Off">Off</option>
      <option value="N/r">N/r</option>
    
    </select>
  );
};

export default OrderStatusCell;