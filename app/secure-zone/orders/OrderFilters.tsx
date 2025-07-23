'use client'
import { Order, Filters } from "./types";

interface OrderFiltersProps {
  filters: Filters;
  uniqueCourses: Order["course"][];
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onResetFilters: () => void;
}

const OrderFilters = ({ filters, uniqueCourses, onFilterChange, onResetFilters }: OrderFiltersProps) => {
  return (
    <div className="p-4 mb-4 bg-white rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
          <select
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={onFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <select
            name="courseId"
            value={filters.courseId}
            onChange={onFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Courses</option>
            {uniqueCourses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.basicInfo.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select
            name="paymentMethod"
            value={filters.paymentMethod}
            onChange={onFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Methods</option>
            <option value="SSL_PAY">SSL Pay</option>
            <option value="BAKSH">Baksh</option>
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;