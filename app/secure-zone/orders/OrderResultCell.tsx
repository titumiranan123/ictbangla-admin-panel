'use client'
import { CheckCircleOutline, PendingOutlined, CancelOutlined } from "@mui/icons-material";

interface OrderResultCellProps {
  order: any;
  onUpdate: (orderId: string, field: keyof any, value: any) => void;
}

const OrderResultCell = ({ order, onUpdate }: OrderResultCellProps) => {
  const currentResult = order.agenda ? order.agenda.result : undefined;

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => onUpdate(order, "result", "true")}
        className={`p-1 rounded ${currentResult === 'true' ? "text-green-500" : "text-gray-400 hover:text-green-300"}`}
        title="Mark as successful"
      >
        <CheckCircleOutline fontSize="small" />
      </button>
      <button
        onClick={() => onUpdate(order, "result", "pending")}
        className={`p-1 rounded ${currentResult === 'pending' ? "text-amber-500" : "text-gray-400 hover:text-amber-300"}`}
        title="Mark as pending"
      >
        <PendingOutlined fontSize="small" />
      </button>
      <button
        onClick={() => onUpdate(order, "result", 'false')}
        className={`p-1 rounded ${currentResult === 'false' ? "text-red-500" : "text-gray-400 hover:text-red-300"}`}
        title="Mark as failed"
      >
        <CancelOutlined fontSize="small" />
      </button>
      {currentResult !== undefined && (
        <span className="text-xs ml-1">
          {currentResult === 'true' ? "Success" : 
           currentResult === 'pending' ? "Pending" : "Failed"}
        </span>
      )}
    </div>
  );
};

export default OrderResultCell;