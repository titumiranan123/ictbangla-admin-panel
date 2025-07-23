export type PaymentStatus = "PAID" | "UNPAID" | "PARTIALLY_PAID";
export type PaymentMethod = "SSL_PAY" | "BAKSH" | "CASH" | "BANK_TRANSFER";
export type CallStatus = "Ok" | "Off" | "N/r" | "Not Called Yet" | "Interested" | "Not Interested" | "In Service";

export interface Course {
  _id: string;
  basicInfo: {
    title: string;
    slug: string;
    short_description: string;
  };
  media: {
    thumbnail: string;
  };
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    user_name: string;
  };
  name: string;
  email: string;
  phone: string;
  course: Course;
  price: number;
  payment_uid: string;
  paymentStatus: PaymentStatus;
  pay_by_admin: boolean;
  payment_method: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  __v: number;
  call_status?: CallStatus;
  note?: string;
  call_agent?: string;
  result?: boolean;
}

export interface Filters {
  page: number;
  perPage: number;
  orderBy: "FROM_OLD" | "FROM_NEW";
  paymentStatus: PaymentStatus | "";
  paymentMethod: PaymentMethod | "";
  search: string;
  courseId?: string;
}

export interface OrderTableProps {
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
}