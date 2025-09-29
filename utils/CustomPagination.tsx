"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationDemoProps {
  totalPage: number;
  page: number;
  setPage: (p: number) => void;
  isLoading?: boolean;
}

export function CustomPagination({
  totalPage,
  page,
  setPage,
  isLoading,
}: PaginationDemoProps) {
  const totalPages = totalPage || 1;

  // Helper function to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, "ellipsis", totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(
          1,
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "ellipsis",
          page - 1,
          page,
          page + 1,
          "ellipsis",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={`${
              isLoading || page <= 1
                ? "pointer-events-none opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) setPage(page - 1);
            }}
          />
        </PaginationItem>

        {/* Page Numbers with Ellipsis */}
        {!isLoading ? (
          getPageNumbers().map((p, idx) =>
            p === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={page === p}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(Number(p));
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )
        ) : (
          <div className="flex justify-center gap-2 mt-3">
            {/* Skeleton loading placeholders */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-9 rounded-md bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            className={`${
              isLoading
                ? "pointer-events-none opacity-50 cursor-not-allowed"
                : ""
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) setPage(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
