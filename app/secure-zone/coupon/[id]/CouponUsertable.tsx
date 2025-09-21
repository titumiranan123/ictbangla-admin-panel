"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@mui/material";

interface CouponUserTableProps {
  data: any[]; // all usedCoupon array
}

export default function CouponUserTable({ data }: CouponUserTableProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item?._id}>
              {/* Order ID */}
              <TableCell>{item?.payment_id?.order_uuid}</TableCell>

              {/* User */}
              <TableCell>
                <div className="font-medium">
                  {item?.user_id?.first_name} {item?.user_id?.last_name}
                </div>
                <div className="text-sm text-gray-500">
                  {item?.user_id?.email}
                </div>
                <div className="text-sm text-gray-500">
                  {item?.user_id?.phones?.[0]?.number}
                </div>
              </TableCell>

              {/* Course */}
              <TableCell>
                {item?.payment_id?.purchases?.[0]?.course?.basicInfo?.title}
              </TableCell>

              {/* Price */}
              <TableCell className="font-semibold">
                Tk {item?.payment_id?.purchases?.[0]?.price}.00
              </TableCell>

              {/* Payment */}
              <TableCell>
                {item?.payment_id?.payMentStatus !== "PAID" ? (
                  <Badge className="bg-green-100 text-green-700">PAID</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700">UNPAID</Badge>
                )}
                <div className="text-sm text-gray-500">
                  {item?.payment_id?.payment_method}
                </div>
              </TableCell>

              {/* Date */}
              <TableCell>
                {new Date(item?.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
