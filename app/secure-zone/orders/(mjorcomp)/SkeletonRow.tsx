import { TableCell, TableRow } from "@/components/ui/table";

export const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className="h-4 w-[120px] bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-[220px] bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-[90px] bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-[90px] bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-[90px] bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-[100px] bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-[150px] bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-[100px] bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 w-[100px] bg-gray-200 rounded animate-pulse"></div>
    </TableCell>
  </TableRow>
);
