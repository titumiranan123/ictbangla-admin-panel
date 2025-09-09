import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { Visibility as ViewIcon } from "@mui/icons-material";
import { useUpdateOrderCallStatus } from "../useUpdateOrderCallStatus";
import useOrderColumns from "../OrderColumns";
import Link from "next/link";

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
        <Link
          target="_blank"
          href={`https://ictbangla.com/checkout/payment?orderId=${row?.original?.order_uuid}`}
          className="p-1 bg-red-500 hover:bg-red-700 rounded-lg text-white px-3 flex justify-center items-center"
          title="View"
        >
          pay
        </Link>

        <button
          onClick={() => setSelectedOrder(row.original)}
          className="p-1 text-blue-500 hidden hover:text-blue-700"
          title="View"
        >
          pay
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
