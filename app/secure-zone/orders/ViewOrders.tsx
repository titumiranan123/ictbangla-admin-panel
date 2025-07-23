'use client'
import React from "react";
import { FiEdit, FiX } from "react-icons/fi";
interface props{
selectedOrder:any
setViewModalOpen:(p:boolean)=>void
openEditModal:(selectedOrder:any)=>void
}
const ViewOrders:React.FC<props> = ({selectedOrder,setViewModalOpen,openEditModal}) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Order Details</h2>
            <button
              onClick={() => setViewModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Order Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Order ID:</span>{" "}
                  {selectedOrder.payment_uid}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs 
                                ${
                                  selectedOrder.paymentStatus === "PAID"
                                    ? "bg-green-100 text-green-800"
                                    : selectedOrder.paymentStatus ===
                                      "PARTIALLY_PAID"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                  >
                    {selectedOrder.paymentStatus.replace("_", " ")}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {selectedOrder.payment_method.replace("_", " ")}
                </p>
                <p>
                  <span className="font-medium">Amount:</span> ৳
                  {selectedOrder.price.toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                Customer Information
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {selectedOrder.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedOrder.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedOrder.phone !== "N/A"
                    ? selectedOrder.phone
                    : "Not provided"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Course Information</h3>
              <div className="flex items-start space-x-4">
                <img
                  src={selectedOrder.course.media.thumbnail}
                  alt={selectedOrder.course.basicInfo.title}
                  className="w-16 h-16 rounded-md object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/64";
                  }}
                />
                <div>
                  <p className="font-medium">
                    {selectedOrder.course.basicInfo.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.course.basicInfo.short_description}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Admin Actions</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {new Date(selectedOrder.updatedAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Paid by Admin:</span>{" "}
                  {selectedOrder.pay_by_admin ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setViewModalOpen(false);
                openEditModal(selectedOrder);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <FiEdit /> Edit Order
            </button>
            <button
              onClick={() => setViewModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;
