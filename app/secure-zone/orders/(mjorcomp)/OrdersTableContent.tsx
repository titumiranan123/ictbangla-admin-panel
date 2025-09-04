import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { Visibility as ViewIcon } from "@mui/icons-material";
import { useUpdateOrderCallStatus } from "../useUpdateOrderCallStatus";
import useOrderColumns from "../OrderColumns";

interface Props {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  orders: any;
  isLoading: boolean;
  refetch: () => void;
  setSelectedOrder: (order: any | null) => void;
}

const OrdersTableContent = ({
  filters,
  setFilters,
  orders,
  isLoading,
  refetch,
  setSelectedOrder,
}: Props) => {
  const { mutate: updateOrderMutation } = useUpdateOrderCallStatus();

  const handleInlineUpdate = (
    orderId: string,
    field: keyof any,
    value: any
  ) => {
    updateOrderMutation({ orderId, updates: { [field]: value }, refetch });
  };

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
      setFilters((prev: any) => ({
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

  return (
    <MaterialReactTable
      key={`table-${filters.page}-${filters.perPage}`}
      table={table}
    />
  );
};

export default OrdersTableContent;
