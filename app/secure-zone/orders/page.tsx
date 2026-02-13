"use client";
import { useState, useMemo, useEffect } from "react";
import { useAllOrders } from "@/hooks/useAllOrders";
import { Order, Filters } from "./types";

import ViewOrderModal from "./ViewOrderModal";
import EditOrderModal from "./EditOrderModal";
import OrdersFilterPanel from "./(mjorcomp)/OrdersFilterPanel";
import OrderTable from "./(mjorcomp)/OrderTable";
import { CustomPagination } from "@/utils/CustomPagination";

const OrdersTable = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    page: page,
    perPage: 10,
    orderBy: "FROM_NEW",
    paymentStatus: "",
    paymentMethod: "",
    search: "",
    courseId: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editFormData, setEditFormData] = useState<boolean>(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const { data: orders, isLoading, refetch } = useAllOrders(filters);
  // Extract unique courses for filter dropdown
  const uniqueCourses = useMemo(() => {
    const courseMap = new Map<string, Order["course"]>();
    orders?.data?.forEach((order: Order) => {
      if (order?.course && order?.course?._id) {
        courseMap?.set(order?.course?._id, order?.course);
      }
    });
    return Array.from(courseMap.values());
  }, [orders?.data]);

  // Update filters when page changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page }));
  }, [page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
      setPage(1); // Reset to first page when searching
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset Filters
  const resetFilters = () => {
    setFilters({
      page: 1,
      perPage: 10,
      orderBy: "FROM_NEW",
      paymentStatus: "",
      paymentMethod: "",
      search: "",
      courseId: "",
    });
    setSearchInput("");
    setPage(1); // Reset page to 1 when resetting filters
  };

  return (
    <div className="container h-screen flex flex-col mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>

      {/* Filter Section */}
      <OrdersFilterPanel
        filters={filters}
        setFilters={setFilters}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        isFilterPanelOpen={isFilterPanelOpen}
        setIsFilterPanelOpen={setIsFilterPanelOpen}
        uniqueCourses={uniqueCourses}
        resetFilters={resetFilters}
        setEditFormData={setEditFormData}
      />

      {/* Order Table */}
      <div className="flex-1 overflow-scroll scrolbarHidden">
        <OrderTable
          data={orders?.data}
          refetch={refetch}
          isLoading={isLoading}
          // Pass this prop to handle row clicks
        />
      </div>

      {/* Pagination */}
      <CustomPagination
        page={page}
        setPage={setPage}
        totalPage={Math.ceil(orders?.totalPages)}
        isLoading={isLoading}
      />

      {/* Modals */}
      {selectedOrder && (
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
      {editFormData && (
        <EditOrderModal
          onClose={() => setEditFormData(false)}
          refetch={() => refetch()}
        />
      )}
    </div>
  );
};

export default OrdersTable;
