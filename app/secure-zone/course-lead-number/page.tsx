"use client";

import { useLeadNumber } from "@/hooks/useNumberLead";
import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { NumberAgent } from "./Nuberagent";
import NumberNoteCell from "./NumberNoteCell";
import NumberStatusCell from "./NumberStatusCell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
const LeadNumber = () => {
  const [page, setPage] = useState(1);

  const filter = {
    page,
  };

  const { data, isLoading, refetch } = useLeadNumber(filter);
  if (isLoading) return <p className="text-center py-6">Loading...</p>;
  // Extract unique courses for filter dropdown
  // const uniqueCourses = useMemo(() => {
  //   const courseMap = new Map();
  //   data.response?.forEach((order: any) => {
  //     if (order?.course) {
  //       courseMap?.set(order?.course?._id, order?.course);
  //     }
  //   });
  //   return Array.from(courseMap.values());
  // }, [data.response]);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }) => row.original._id.slice(-6),
    },
    {
      accessorKey: "course.title",
      header: "Course",
      cell: ({ row }) => (
        <div
          title={`${row.original.course.title}`}
          className="flex items-center gap-2 w-[200px]  "
        >
          <span>{row.original.course.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "course.price",
      header: "Price",
      cell: ({ row }) => `Tk.${row.original.course.price}`,
    },
    {
      accessorKey: "number",
      header: "Number",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        const res = date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

        return <div className="w-24">{res}</div>;
      },
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
    // {
    //   accessorKey: "action",
    //   header: "Action",
    //   cell: () => (
    //     <button className="text-sm px-2 py-1 bg-blue-500 text-white rounded">
    //       Call
    //     </button>
    //   ),
    // },
  ];

  return (
    <div className="md:p-4 p-1">
      <h2 className="text-xl font-semibold mb-4">Lead Numbers</h2>
      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course
        </label>
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
      </div> */}
      <DataTable data={data.response} columns={columns} />
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {Array.from({ length: data?.totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={page === i + 1}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < data?.totalPages) setPage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default LeadNumber;
