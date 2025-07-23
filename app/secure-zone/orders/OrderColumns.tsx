"use client";
import { useMemo } from "react";
import { MRT_ColumnDef } from "material-react-table";

import OrderStatusCell from "./OrderStatusCell";

import Image from "next/image";
import OrderResultCell from "./OrderResultCell";
import OrderNoteCell from "./OrderNoteCell";
import { OrderAgentCell } from "./Orderagent";

const useOrderColumns = (
  handleInlineUpdate: (orderId: string, field: keyof any, value: any) => void
) => {
  return useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "payment_uid",
        header: "Order ID",
        size: 150,
      },
      {
        accessorKey: "name",
        header: "User",
        size: 200,
        Cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
            {row.original.phone !== "N/A" && (
              <div className="text-sm text-gray-500">{row.original.phone}</div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "course.basicInfo.title",
        header: "Course",
        size: 200,
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Image
              src={row.original.course?.media?.thumbnail}
              alt={row.original.course?.basicInfo?.title}
              className="w-10 h-10 rounded object-cover"
              priority
              width={50}
              height={50}
            />
            <div className="truncate max-w-[150px]">
              {row.original.course?.basicInfo?.title}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 100,
        Cell: ({ cell }) => (
          <div className="font-medium">
            ৳{cell.getValue<number>().toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment",
        size: 150,
        Cell: ({ row }) => (
          <div>
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
        size: 120,
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
      {
        accessorKey: "callStatus",
        header: "Call Status",
        size: 150,
        Cell: ({ row }) => (
          <OrderStatusCell order={row.original} onUpdate={handleInlineUpdate} />
        ),
      },
      {
        accessorKey: "note",
        header: "Note",
        size: 200,
        Cell: ({ row }) => (
          <OrderNoteCell order={row.original} onUpdate={handleInlineUpdate} />
        ),
      },
      {
        accessorKey: "callAgent",
        header: "Call Agent",
        size: 150,
        Cell: ({ row }) => (
          <OrderAgentCell order={row.original} onUpdate={handleInlineUpdate} />
        ),
      },
      {
        accessorKey: "result",
        header: "Result",
        size: 100,
        Cell: ({ row }) => (
          <OrderResultCell order={row.original} onUpdate={handleInlineUpdate} />
        ),
      },
    ],
    [handleInlineUpdate]
  );
};

export default useOrderColumns;
