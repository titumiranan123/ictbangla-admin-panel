"use client";
// components/CouponForm.tsx
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectCourse from "./SelectCourse";
import { useState } from "react";

interface Coupon {
  title: string;
  is_global: boolean;
  start_time: string;
  end_time: string;
  reduce_percent: number;
  coupon_code: string;
  course_id?: string;
}

interface CouponFormProps {
  onSubmit: (data: Coupon) => void;
  initialData?: Coupon;
  isEditing?: boolean;
}
const CouponForm = ({
  onSubmit,
  initialData,
  isEditing = false,
}: CouponFormProps) => {
  const [formData, setFormData] = useState<any>({
    courses: [
      {
        courseId: "",
      },
    ],
  });
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Coupon>({
    defaultValues: initialData || {
      title: "",
      is_global: false,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      reduce_percent: 0,
      coupon_code: "",
      course_id: "",
    },
  });

  const isGlobal = watch("is_global");

  const onSubmitHandler = (data: Coupon) => {
    const coupondata = { ...data, course_id: formData?.courses[0]?.courseId };
    onSubmit(coupondata);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? "Edit Coupon" : "Create New Coupon"}
      </h2>

      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Coupon Title *
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "Title is required" })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Summer Sale 2025"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Coupon Code */}
        <div>
          <label
            htmlFor="coupon_code"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Coupon Code *
          </label>
          <input
            id="coupon_code"
            type="text"
            {...register("coupon_code", {
              required: "Coupon code is required",
            })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.coupon_code ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="SUMMER25"
          />
          {errors.coupon_code && (
            <p className="mt-1 text-sm text-red-600">
              {errors.coupon_code.message}
            </p>
          )}
        </div>

        {/* Discount Percentage */}
        <div>
          <label
            htmlFor="reduce_percent"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Discount Percentage *
          </label>
          <div className="relative">
            <input
              id="reduce_percent"
              type="number"
              min="1"
              max="100"
              {...register("reduce_percent", {
                required: "Discount percentage is required",
                min: { value: 1, message: "Discount must be at least 1%" },
                max: { value: 100, message: "Discount cannot exceed 100%" },
              })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.reduce_percent ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="20"
            />
            <span className="absolute right-3 top-2 text-gray-500">%</span>
          </div>
          {errors.reduce_percent && (
            <p className="mt-1 text-sm text-red-600">
              {errors.reduce_percent.message}
            </p>
          )}
        </div>

        {/* Global Coupon Toggle */}
        <div className="flex items-center">
          <input
            id="is_global"
            type="checkbox"
            {...register("is_global")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="is_global"
            className="ml-2 block text-sm text-gray-700"
          >
            Apply to all courses (Global Coupon)
          </label>
        </div>

        {/* Course ID (conditionally shown) */}
        {!isGlobal && (
          <SelectCourse formData={formData} setFormData={setFormData} />
        )}

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <Controller
              control={control}
              name="start_time"
              rules={{ required: "Start date is required" }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date?.toISOString())}
                  selectsStart
                  startDate={new Date(watch("start_time"))}
                  endDate={new Date(watch("end_time"))}
                  minDate={new Date()}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.start_time ? "border-red-500" : "border-gray-300"
                  }`}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                />
              )}
            />
            {errors.start_time && (
              <p className="mt-1 text-sm text-red-600">
                {errors.start_time.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <Controller
              control={control}
              name="end_time"
              rules={{
                required: "End date is required",
                validate: (value) =>
                  new Date(value) > new Date(watch("start_time")) ||
                  "End date must be after start date",
              }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date?.toISOString())}
                  selectsEnd
                  startDate={new Date(watch("start_time"))}
                  endDate={new Date(watch("end_time"))}
                  minDate={new Date(watch("start_time"))}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.end_time ? "border-red-500" : "border-gray-300"
                  }`}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                />
              )}
            />
            {errors.end_time && (
              <p className="mt-1 text-sm text-red-600">
                {errors.end_time.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {isEditing ? "Update Coupon" : "Create Coupon"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
