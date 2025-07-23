'use client'
import { Order } from "./types";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

interface ViewOrderModalProps {
  order: Order;
  onClose: () => void;

}

const ViewOrderModal = ({ order, onClose }: ViewOrderModalProps) => {
  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div className="flex justify-between items-center">
          <span>Order Details: {order.payment_uid}</span>
          <Button
            startIcon={<EditIcon />}
            onClick={() => {
              onClose();
            }}
            variant="outlined"
            size="small"
          >
            Edit
          </Button>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="font-medium">Customer Information</h3>
            <div className="mt-2 space-y-1">
              <p><span className="text-gray-600">Name:</span> {order.name}</p>
              <p><span className="text-gray-600">Email:</span> {order.email}</p>
              <p><span className="text-gray-600">Phone:</span> {order.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Order Information</h3>
            <div className="mt-2 space-y-1">
              <p><span className="text-gray-600">Course:</span> {order.course.basicInfo.title}</p>
              <p><span className="text-gray-600">Price:</span> ৳{order.price.toFixed(2)}</p>
              <p>
                <span className="text-gray-600">Payment Status:</span> 
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  order.paymentStatus === "PAID" ? "bg-green-100 text-green-800" :
                  order.paymentStatus === "PARTIALLY_PAID" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {order.paymentStatus.replace("_", " ")}
                </span>
              </p>
              <p><span className="text-gray-600">Method:</span> {order.payment_method.replace("_", " ")}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Call Information</h3>
            <div className="mt-2 space-y-1">
              <p><span className="text-gray-600">Status:</span> {order.call_status || "Not Called Yet"}</p>
              <p><span className="text-gray-600">Agent:</span> {order.call_agent || "N/A"}</p>
              <p><span className="text-gray-600">Result:</span> 
                {order.hasOwnProperty('result') ? (
                  order.result ? "Success" : "Failed"
                ) : "Not set"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Notes</h3>
            <div className="mt-2 p-2 bg-gray-50 rounded">
              {order.note || "No notes available"}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewOrderModal;