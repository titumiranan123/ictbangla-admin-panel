"use client";

import { useLeadNumber } from "@/hooks/useNumberLead";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { NumberAgent } from "./Nuberagent";
import NumberNoteCell from "./NumberNoteCell";
import NumberStatusCell from "./NumberStatusCell";

const LeadNumber = () => {
  const [page, setPage] = useState(1);

  const filter = {
    page,
  };

  const { data, isLoading, refetch } = useLeadNumber(filter);
  console.log(data?.response?.[0]?.call_agent);

  if (isLoading) return <p className="text-center py-6">Loading...</p>;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }) => row.original._id.slice(-6), // show last 6 chars
    },
    {
      accessorKey: "course.title",
      header: "Course",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <img
            src={row.original.course.thumbnail}
            alt={row.original.course.title}
            className="w-10 h-10 rounded object-cover"
          />
          <span>{row.original.course.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "course.price",
      header: "Price",
      cell: ({ row }) => `৳ ${row.original.course.price}`,
    },
    {
      accessorKey: "number",
      header: "Number",
    },
    {
      accessorKey: "callStatus",
      header: "Call Status",
      cell: ({ row }) => (
        <NumberStatusCell order={row.original} refetch={refetch} />
      ),
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => (
        <NumberNoteCell order={row.original} refetch={refetch} />
      ),
    },
    {
      accessorKey: "agent",
      header: "Call Agent",
      cell: ({ row }) => <NumberAgent order={row.original} refetch={refetch} />,
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: () => (
        <button className="text-sm px-2 py-1 bg-blue-500 text-white rounded">
          Call
        </button>
      ),
    },
  ];

  return (
    <div className="md:p-4 p-1">
      <h2 className="text-xl font-semibold mb-4">Lead Numbers</h2>
      <DataTable data={data.response} columns={columns} />
    </div>
  );
};

export default LeadNumber;
