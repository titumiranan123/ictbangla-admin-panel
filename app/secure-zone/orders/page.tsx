'use client'
import { useState, useMemo, useEffect, useCallback } from "react";
import { useAllOrders } from "@/hooks/useAllOrders";
import { useUpdateOrderCallStatus } from "./useUpdateOrderCallStatus";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import OrderFilters from "./OrderFilters";
import useOrderColumns from "./OrderColumns";
import ViewOrderModal from "./ViewOrderModal";
import EditOrderModal from "./EditOrderModal";
import { Order, Filters } from "./types";
import { Search as SearchIcon, FilterAlt as FilterIcon, Close as CloseIcon, Visibility as ViewIcon,
  Edit as EditIcon } from "@mui/icons-material";

const OrdersTable = () => {
  const [filters, setFilters] = useState<Filters>({
    page: 1,
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

  const { mutate: updateOrderMutation } = useUpdateOrderCallStatus();
  const { data: orders, isLoading } = useAllOrders(filters);

  // Extract unique courses for filter
  const uniqueCourses = useMemo(() => {
    const courseMap = new Map<string, Order["course"]>();
    orders?.data?.forEach((order: Order) => {
      if (order.course && order.course._id) {
        courseMap.set(order.course._id, order.course);
      }
    });
    return Array.from(courseMap.values());
  }, [orders?.data]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleInlineUpdate = useCallback(
    (orderId: string, field: keyof any, value: any) => {
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, [field]: value } : prev));
      }
     
      updateOrderMutation({ orderId, updates: { [field]: value } });
    },
    [selectedOrder, editFormData, updateOrderMutation]
  );

  const columns = useOrderColumns(handleInlineUpdate);

  const table = useMaterialReactTable({
    columns,
    data: orders?.data || [],
    manualPagination: true,
    rowCount: orders?.total || 0,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex: filters.page - 1, pageSize: filters.perPage })
          : updater;
      setFilters((prev) => ({
        ...prev,
        page: newPagination.pageIndex + 1,
        perPage: newPagination.pageSize,
      }));
    },
    state: {
      pagination: {
        pageIndex: filters.page - 1,
        pageSize: filters.perPage,
      },
      isLoading,
    },
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <div className="flex gap-1">
        <button
          onClick={() => setSelectedOrder(row.original)}
          className="p-1 text-blue-500 hover:text-blue-700"
          title="View"
        >
          <ViewIcon fontSize="small" />
        </button>
        
      </div>
    ),
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

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
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Order Management</h1>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <SearchIcon />
            </div>
          </div>

          <div className="flex gap-2">
            <button
          onClick={() => setEditFormData(true)}
          className="p-1 text-purple-500 hover:text-purple-700"
          title="Edit"
        >
          <EditIcon fontSize="small" />
        </button>
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="px-4 py-2 border rounded flex items-center gap-2"
            >
              {isFilterPanelOpen ? <CloseIcon /> : <FilterIcon />}
              <span>Filters</span>
            </button>
            {Object.values(filters).some(
              (val) => val !== "" && val !== "FROM_NEW" && val !== 10 && val !== 1
            ) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 border rounded"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {isFilterPanelOpen && (
          <OrderFilters
            filters={filters}
            uniqueCourses={uniqueCourses}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
          />
        )}
      </div>

      <MaterialReactTable table={table} />

      {selectedOrder && (
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
         
        />
      )}

      {editFormData && (
        <EditOrderModal
         
          onClose={() => setEditFormData(false)}
          
        />
      )}
    </div>
  );
};

export default OrdersTable;