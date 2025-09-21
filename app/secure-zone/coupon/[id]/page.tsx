import React from "react";
import CouponDetails from "./CouponDetails";

type Props = {
  params: Promise<{ id: string }>;
};

const CouponPage = async ({ params }: Props) => {
  const courseId = (await params).id;

  return (
    <div>
      <CouponDetails courseId={courseId} key={courseId} />
    </div>
  );
};

export default CouponPage;
