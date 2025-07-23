/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useForm } from "react-hook-form";
import Input from "../shared/Input";
import MyTextEditor from "../shared/Texteditor";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useCategory from "@/hooks/useCategory";
import { setBasicInfo } from "@/redux/features/courseSlice";
import { FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

interface IBasicInfo {
  title: string;
  slug?: string;
  short_description: string;
  description: string;
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT/SPECIALIZED";
  status: "PENDING" | "PUBLISHED" | "UPCOMING" | "REJECTED";
  topCourse: boolean;
}

const BasicInfo = ({
  setActiveTab,
}: {
  setActiveTab: (label: string) => void;
}) => {
  const dispatch = useDispatch();
  const basicInfo = useSelector((state: RootState) => state?.course?.basicInfo);
  const { data: allcategory } = useCategory();

  const {
    handleSubmit,
    formState: { errors, isDirty, isValid },
    control,
    register,
    watch,
  } = useForm<IBasicInfo>({
    defaultValues: basicInfo,
    mode: "onChange",
  });

  const onSubmit = (data: IBasicInfo) => {
    dispatch(setBasicInfo(data));
    setActiveTab("Media & Seo");
  };

  const watchedValues = watch();

  return (
    <div className="w-full relative">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Course Basic Information
        </h2>
        <p className="text-gray-600 flex items-center gap-2">
          <FiInfo className="text-blue-500" />
          Fill in the basic details about your course
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Course Title */}
          <div className="relative">
            <Input
              label="Course Title"
              register={register}
              error={errors.title}
              validation={{ 
                required: "Course Title is required",
                minLength: {
                  value: 10,
                  message: "Title should be at least 10 characters"
                }
              }}
              name="title"
              type="text"
              placeholder="e.g., Advanced React Development with TypeScript"
              className={`w-full p-3 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {watchedValues.title?.length > 0 && !errors.title && (
              <FiCheckCircle className="absolute right-3 top-10 text-green-500" />
            )}
          </div>
          
          {/* Short Description */}
          <div className="relative">
            <Input
              label="Short Description"
              register={register}
              error={errors.short_description}
              validation={{ 
                required: "Short Description is required",
                maxLength: {
                  value: 460,
                  message: "Should be less than 160 characters"
                }
              }}
              name="short_description"
              type="text"
              placeholder="Brief summary that appears in course cards (max 460 chars)"
              className={`w-full p-3 border ${errors.short_description ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            <div className="absolute right-3 top-10 text-xs text-gray-500">
              {watchedValues.short_description?.length || 0}/460
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-medium flex items-center gap-2">
              Description
              {errors.description && (
                <span className="text-red-500 text-sm flex items-center gap-1">
                  <FiAlertCircle /> {errors.description.message}
                </span>
              )}
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ 
                required: "Description is required",
                validate: (value) => 
                  value?.length > 50 || "Description should be at least 50 characters"
              }}
              render={({ field, fieldState: { error } }) => (
                <div className={`border ${error ? 'border-red-300' : 'border-gray-300'} rounded-lg overflow-hidden`}>
                  <MyTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    error={error?.message || ""}
                  />
                  <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 flex justify-between">
                    <span>Minimum 50 characters</span>
                    <span>{field.value?.length || 0} characters</span>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Category, Status, Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Category</label>
              <div className="relative">
                <select
                  className={`w-full p-3 border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none`}
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="">Select a category</option>
                  {allcategory?.map((category: any, indx: number) => (
                    <option value={`${category._id}`} key={indx}>
                      {category.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <FiAlertCircle /> {errors.category.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Status</label>
              <div className="relative">
                <select
                  className={`w-full p-3 border ${errors.status ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none`}
                  {...register("status", {
                    required: "Status is required",
                  })}
                >
                  <option value="">Select status</option>
                  <option value="PENDING">Pending</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              {errors.status && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <FiAlertCircle /> {errors.status.message}
                </p>
              )}
            </div>

            {/* Level */}
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Level</label>
              <div className="relative">
                <select
                  className={`w-full p-3 border ${errors.level ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none`}
                  {...register("level", {
                    required: "Level is required",
                  })}
                >
                  <option value="">Select level</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT/SPECIALIZED">Expert/Specialized</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              {errors.level && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <FiAlertCircle /> {errors.level.message}
                </p>
              )}
            </div>
          </div>

          {/* Top Course Checkbox */}
          <div className="flex items-center space-x-3 mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="topCourse"
                {...register("topCourse")}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="topCourse" className="text-gray-700 font-medium">
                Mark as Top Course
              </label>
              <p className="text-gray-500 text-sm">
                Featured courses appear on the homepage
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {isDirty && (
              <span className="flex items-center gap-2">
                <FiInfo className="text-blue-500" />
                You have unsaved changes
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!isDirty || !isValid}
            className={`px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-md ${
              !isDirty || !isValid
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Save & Continue to Media-Seo
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicInfo;