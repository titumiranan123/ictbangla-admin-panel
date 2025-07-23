/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RootState } from "@/redux/store";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { api_url } from "@/hooks/apiurl";
import { resetCourse, setPricing } from "@/redux/features/courseSlice";

interface IPricing {
  isFree: boolean;
  price: {
    main: number;
    isDiscount: boolean;
    discount: number;
    percentage: number;
  };
  expiry: {
    status: boolean;
    date: string | null;
  };
}

const CoursePricing: React.FC = () => {
  const dispatch = useDispatch();
  const course = useSelector((state: RootState) => state.course);
  const pricingInfo = useSelector((state: RootState) => state.course.pricing);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IPricing>({ defaultValues: pricingInfo });

 const onSubmit = async (data: IPricing) => {
    dispatch(setPricing(data));

    const formData = new FormData();

    // ✅ Basic Info
    formData.append("basicInfo[title]", course.basicInfo.title);

    formData.append(
      "basicInfo[short_description]",
      course.basicInfo.short_description
    );
    formData.append("basicInfo[description]", course.basicInfo.description);
    formData.append("basicInfo[category]", course.basicInfo.category);
    formData.append("basicInfo[level]", course.basicInfo.level);
    formData.append("basicInfo[status]", course.basicInfo.status);
    formData.append(
      "basicInfo[topCourse]",
      course.basicInfo.topCourse.toString()
    );

    // ✅ FAQ (array)
    course.info.faq.forEach((item, index) => {
      formData.append(`info[faq][${index}][question]`, item.question);
      formData.append(`info[faq][${index}][answer]`, item.answer);
    });

    // ✅ Requirement
    formData.append(
      "info[requirement][category]",
      course.info.requirement.category
    );
    if (
      course.info.requirement.category === "paragraph" &&
      course.info.requirement.paragraph
    ) {
      formData.append(
        "info[requirement][paragraph]",
        course.info.requirement.paragraph
      );
    }
    if (
      course.info.requirement.category === "point" &&
      course.info.requirement.point
    ) {
      course.info.requirement.point.forEach((point, idx) => {
        formData.append(`info[requirement][point][${idx}]`, point);
      });
    }
    if (
      course.info.requirement.category === "question" &&
      course.info.requirement.question
    ) {
      course.info.requirement.question.forEach((q, idx) => {
        formData.append(
          `info[requirement][question][${idx}][question]`,
          q.question
        );
        if (q.answer) {
          formData.append(
            `info[requirement][question][${idx}][answer]`,
            q.answer
          );
        }
      });
    }

    // ✅ Outcomes (same structure as requirement)
    formData.append("info[outcomes][category]", course.info.outcomes.category);
    if (
      course.info.outcomes.category === "paragraph" &&
      course.info.outcomes.paragraph
    ) {
      formData.append(
        "info[outcomes][paragraph]",
        course.info.outcomes.paragraph
      );
    }
    if (
      course.info.outcomes.category === "point" &&
      course.info.outcomes.point
    ) {
      course.info.outcomes.point.forEach((point, idx) => {
        formData.append(`info[outcomes][point][${idx}]`, point);
      });
    }

    if (
      course.info.outcomes.category === "question" &&
      course.info.outcomes.question
    ) {
      course.info.outcomes.question.forEach((q, idx) => {
        formData.append(
          `info[outcomes][question][${idx}][question]`,
          q.question
        );
        if (q.answer) {
          formData.append(`info[outcomes][question][${idx}][answer]`, q.answer);
        }
      });
    }

    // ✅ Pricing
    formData.append("pricing[isFree]", data?.isFree.toString());
    formData.append(
      "pricing[price][main]",
      data?.price?.main.toString()
    );
    formData.append(
      "pricing[price][isDiscount]",
      data?.price?.isDiscount.toString()
    );
    formData.append(
      "pricing[price][discount]",
      data?.price?.discount.toString()
    );
    formData.append(
      "pricing[price][percentage]",
      data?.price?.percentage.toString()
    );
    formData.append(
      "pricing[expiry][status]",
      data?.expiry?.status.toString()
    );
    formData.append("pricing[expiry][date]", course.pricing.expiry.date ?? "");
    // ✅ Media
    if (course.media.videoId) {
      formData.append("media[videoId]", course.media.videoId);
    }
    if (course.media && course.media.thumbnail) {
      formData.append("thumbnail", course.media.thumbnail);
    }
    // ✅ SEO
    formData.append("seo[description]", course.seo.description);
    course.seo.keywords.forEach((keyword, index) => {
      formData.append(`seo[keywords][${index}]`, keyword);
    });
    try {
      const result = await api_url.post(
        "/v1/admin-user/create-course",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (result.status ===201) {
        dispatch(resetCourse())
        toast.success("Course created successfully");
        // router.push("/instructor-mycourses");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const isFree = watch("isFree");
  const hasDiscount = watch("price.isDiscount");
  const hasExpiry = watch("expiry.status");

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg ">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Pricing</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Free Course Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <h3 className="font-medium text-gray-700">Free Course</h3>
            <p className="text-sm text-gray-500">
              Enable if this course should be free
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              {...register("isFree")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* Pricing Section */}
        {!isFree && (
          <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-700">Pricing Details</h3>
            
            {/* Main Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("price.main", { 
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" }
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.price?.main
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-green-300 focus:border-green-500"
                }`}
                step="0.01"
                min="0"
              />
              {errors.price?.main && (
                <p className="mt-1 text-sm text-red-600">{errors.price.main.message}</p>
              )}
            </div>

            {/* Discount Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-700">Enable Discount</h3>
                <p className="text-sm text-gray-500">
                  Add special pricing for your course
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register("price.isDiscount")}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {/* Discount Details */}
            {hasDiscount && (
              <div className="grid md:grid-cols-2 gap-6 mt-4 p-4 bg-white rounded-lg border border-gray-100">
                {/* Discount Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Amount ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("price.discount", {
                      required: "Discount amount is required",
                      min: { value: 0, message: "Must be positive" },
                      validate: (value: number) =>
                        value < watch("price.main") || "Must be less than main price",
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.price?.discount
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-green-300 focus:border-green-500"
                    }`}
                    step="0.01"
                    min="0"
                  />
                  {errors.price?.discount && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.discount.message}</p>
                  )}
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percentage (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("price.percentage", {
                      required: "Percentage is required",
                      min: { value: 0, message: "Must be at least 0%" },
                      max: { value: 100, message: "Cannot exceed 100%" },
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.price?.percentage
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-green-300 focus:border-green-500"
                    }`}
                    min="0"
                    max="100"
                  />
                  {errors.price?.percentage && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.percentage.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expiry Section */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-700">Course Expiry</h3>
              <p className="text-sm text-gray-500">
                Set an expiration date for course access
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register("expiry.status")}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {hasExpiry && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("expiry.date", { required: "Expiry date is required" })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.expiry?.date
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-green-300 focus:border-green-500"
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.expiry?.date && (
                <p className="mt-1 text-sm text-red-600">{errors.expiry.date.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm"
          >
            Save Pricing Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoursePricing;