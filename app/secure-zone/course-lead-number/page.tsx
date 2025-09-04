"use client";

import { useLeadNumber } from "@/hooks/useNumberLead";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";

const LeadNumber = () => {
  const [page, setPage] = useState(1);

  const filter = {
    page,
  };

  const { data, isLoading } = useLeadNumber(filter);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (isLoading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="md:p-4 p-1">
      <h2 className="text-xl font-semibold mb-4">Lead Numbers</h2>

      {/* Table */}
      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-bold">Course</TableCell>
              <TableCell className="font-bold">Price</TableCell>
              <TableCell className="font-bold">Number</TableCell>
              <TableCell className="font-bold">Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.response?.map((item: any) => (
              <TableRow key={item._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      className="w-12 h-12 lg:flex hidden rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium ">{item.course.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.course.course_type}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>৳ {item.course.price}</TableCell>
                <TableCell>{item.number}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true, // চাইলে 24 ঘন্টার জন্য false করো
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          count={data?.totalPages || 1}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default LeadNumber;
