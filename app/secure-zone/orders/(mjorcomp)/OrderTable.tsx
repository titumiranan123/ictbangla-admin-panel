import { handleToCopyText } from "@/utils/handleCopy";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import OrderStatusCell from "../OrderStatusCell";
import OrderNoteCell from "../OrderNoteCell";
import { OrderAgentCell } from "../Orderagent";
import OrderResultCell from "../OrderResultCell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { SkeletonRow } from "./SkeletonRow";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import OrderAction from "./OrderAction";

const OrderTable = ({
  data = [],
  refetch,
  isLoading,
}: {
  data: any;
  refetch: () => void;
  isLoading: boolean;
}) => {
  const [columnVisibility, setColumnVisibility] = React.useState<any>({});
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "order_uuid",
      header: "Order ID",
      cell: ({ row }) => (
        <div
          className="relative font-medium cursor-pointer group max-w-[120px]"
          onClick={() => handleToCopyText(row.original.order_uuid)}
        >
          {row.original.order_uuid?.slice(10)}
          <span className="absolute inset-0 hidden px-2 py-1 text-green-500 bg-gray-200 backdrop-blur-2xl text-[12px] w-16 h-10 rounded opacity-0 group-hover:block group-hover:opacity-100 transition-opacity">
            Click to copy
          </span>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium">{row.original.name}</div>
          <div
            onClick={() => handleToCopyText(row.original.email)}
            className="text-sm text-gray-500 break-words"
          >
            {row.original.email}
          </div>
          {row.original.phone !== "N/A" && (
            <div
              onClick={() => handleToCopyText(row.original.phone)}
              className="text-sm text-gray-500"
            >
              {row.original.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "course.basicInfo.title",
      header: "Course",
      cell: ({ row }) => (
        <div className="w-[220px]">{row.original.course?.basicInfo?.title}</div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="font-medium w-[140px] flex flex-col ">
          <p>Tk. {row?.original?.paymentId?.price}</p>
          <p
            className="text-[12px]"
            onClick={() => handleToCopyText(row?.original?.used_coupon?.code)}
          >
            {row?.original?.used_coupon?.code &&
              `Coupon : ${row?.original?.used_coupon?.code}`}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => (
        <div className="w-[90px]">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.original.paymentStatus === "PAID"
                ? "bg-green-100 text-green-800"
                : row.original.paymentStatus === "PARTIALLY_PAID"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.paymentStatus.replace("_", " ")}
          </span>
          <div className="text-xs text-gray-500 capitalize">
            {row.original.payment_method?.toLowerCase()?.replace("_", " ")}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ cell }) => {
        const date = new Date(cell.getValue<string>()).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        return <div className="w-[90px]">{date}</div>;
      },
    },
    {
      accessorKey: "callStatus",
      header: "Call Status",
      cell: ({ row }) => (
        <OrderStatusCell order={row.original} refetch={refetch} />
      ),
    },
    {
      accessorKey: "note",
      header: "Note",
      size: 200,
      cell: ({ row }) => (
        <OrderNoteCell order={row.original} refetch={refetch} />
      ),
    },
    {
      accessorKey: "callAgent",
      header: "Call Agent",
      size: 150,
      cell: ({ row }) => (
        <OrderAgentCell order={row.original} refetch={refetch} />
      ),
    },
    {
      accessorKey: "result",
      header: "Result",
      size: 100,
      cell: ({ row }) => (
        <OrderResultCell order={row.original} refetch={refetch} />
      ),
    },
    {
      accessorKey: "Action",
      header: "Action",
      size: 100,
      cell: ({ row }) => (
        <OrderAction
          data={row?.original}
          key={row.original}
          refetch={refetch}
        />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="h-full relative">
      {/* Column Toggle */}
      <div className="sticky top-0 h-[45px] shadow bg-white z-30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Toggle Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {table.getAllLeafColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                className="capitalize"
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="table relative overflow-x-auto overflow-y-auto">
        <Table className="mt-4  h-full">
          <TableHeader className="sticky top-0 bg-white z-10">
            {table.getHeaderGroups().map((headerGrop) => (
              <TableRow key={headerGrop.id}>
                {headerGrop.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array(5) // number of skeleton rows
                  .fill(0)
                  .map((_, idx) => <SkeletonRow key={idx} />)
              : table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderTable;
