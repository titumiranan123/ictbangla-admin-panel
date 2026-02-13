/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useRef, useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { api_url } from "@/hooks/apiurl";
import Image from "next/image";
import { FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
// import MyTextEditor from "@/component/shared/Texteditor";

type FormData = {
  title: string;
  slug: string;
  category: string;
  sub_title: string;
  feature_image?: string;
  card_image?: string;
  description: string;
  short_description: string;
  learnPoints: string[];
  requirements: string[];
  content_image1: {
    image?: string;
    caption: string;
    file?: FileList;
  };
  content_image2: {
    image?: string;
    caption: string;
    file?: FileList;
  };
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const BlogUploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    featureImage: 0,
    cardImage: 0,
    contentImage1: 0,
    contentImage2: 0,
  });
  const [isUploading, setIsUploading] = useState({
    featureImage: false,
    cardImage: false,
    contentImage1: false,
    contentImage2: false,
  });

  const [selectedFeatureImage, setSelectedFeatureImage] = useState<
    string | null
  >(null);
  const [selectedCardImage, setSelectedCardImage] = useState<string | null>(
    null,
  );
  const [selectedContentImage1, setSelectedContentImage1] = useState<
    string | null
  >(null);
  const [selectedContentImage2, setSelectedContentImage2] = useState<
    string | null
  >(null);

  const featureImageInputRef = useRef<HTMLInputElement>(
    null,
  ) as React.RefObject<HTMLInputElement>;
  const cardImageInputRef = useRef<HTMLInputElement>(
    null,
  ) as React.RefObject<HTMLInputElement>;
  const contentImage1InputRef = useRef<HTMLInputElement>(
    null,
  ) as React.RefObject<HTMLInputElement>;
  const contentImage2InputRef = useRef<HTMLInputElement>(
    null,
  ) as React.RefObject<HTMLInputElement>;

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      learnPoints: [""],
      requirements: [""],
      content_image1: { caption: "", image: "" },
      content_image2: { caption: "", image: "" },
    },
  });

  const featureImageFile = watch("feature_image");
  const cardImageFile = watch("card_image");
  const contentImage1 = watch("content_image1");
  const contentImage2 = watch("content_image2");

  const categoryOptions = useMemo(
    () => [
      { value: "", label: "Select a category", disabled: true },
      { value: "technology", label: "Technology" },
      { value: "business", label: "Business" },
      { value: "health", label: "Health & Wellness" },
      { value: "education", label: "Education" },
      { value: "lifestyle", label: "Lifestyle" },
      { value: "other", label: "Other" },
    ],
    [],
  );

  const handleImageUpload = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      fieldName:
        | "feature_image"
        | "card_image"
        | "content_image1"
        | "content_image2",
      setPreview: (value: string | null) => void,
      currentImage: string | undefined,
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error("Only JPG, PNG, and WEBP images are allowed");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("File Too Large. Maximum file size is 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const uploadKey =
        fieldName === "content_image1"
          ? "contentImage1"
          : fieldName === "content_image2"
            ? "contentImage2"
            : fieldName === "feature_image"
              ? "featureImage"
              : "cardImage";

      setIsUploading((prev) => ({ ...prev, [uploadKey]: true }));
      setUploadProgress((prev) => ({ ...prev, [uploadKey]: 0 }));

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api_url.post<{ url: string }>(
          "/v1/file/upload-cloudinary",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1),
              );
              setUploadProgress((prev) => ({
                ...prev,
                [uploadKey]: percentCompleted,
              }));
            },
          },
        );

        if (fieldName === "content_image1" || fieldName === "content_image2") {
          setValue(`${fieldName}.image`, response.data.url, {
            shouldValidate: true,
          });
        } else {
          setValue(fieldName, response.data.url, { shouldValidate: true });
        }

        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Upload failed:", error);
        setPreview(currentImage || null);
        toast.error("Failed to upload image");
      } finally {
        setIsUploading((prev) => ({ ...prev, [uploadKey]: false }));
      }
    },
    [setValue],
  );

  const handleRemoveImage = useCallback(
    (
      fieldName:
        | "feature_image"
        | "card_image"
        | "content_image1"
        | "content_image2",
      setPreview: (value: string | null) => void,
    ) => {
      setPreview(null);

      const refMap = {
        feature_image: featureImageInputRef,
        card_image: cardImageInputRef,
        content_image1: contentImage1InputRef,
        content_image2: contentImage2InputRef,
      };

      if (fieldName === "content_image1" || fieldName === "content_image2") {
        setValue(`${fieldName}.image`, "", { shouldValidate: true });
      } else {
        setValue(fieldName, "", { shouldValidate: true });
      }

      if (refMap[fieldName].current) {
        refMap[fieldName].current!.value = "";
      }
    },
    [setValue],
  );

  const triggerFileInput = useCallback(
    (ref: React.RefObject<HTMLInputElement>) => {
      if (ref.current) ref.current.click();
    },
    [],
  );

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...data,
        content_image1: {
          image: data.content_image1.image,
          caption: data.content_image1.caption,
        },
        content_image2: {
          image: data.content_image2.image,
          caption: data.content_image2.caption,
        },
      };

      const res = await api_url.post(`/v1/user/create/blog`, submissionData);
      if (res.status === 200 || res.status === 201) {
        toast.success("Blog created! Wait for publish.");
        resetForm();
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Blog create failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    reset({
      title: "",
      slug: "",
      category: "",
      sub_title: "",
      description: "",
      short_description: "",
      feature_image: "",
      card_image: "",
      learnPoints: [""],
      requirements: [""],
      content_image1: { caption: "", image: "" },
      content_image2: { caption: "", image: "" },
    });
    setSelectedFeatureImage(null);
    setSelectedCardImage(null);
    setSelectedContentImage1(null);
    setSelectedContentImage2(null);
    setUploadProgress({
      featureImage: 0,
      cardImage: 0,
      contentImage1: 0,
      contentImage2: 0,
    });
    [
      featureImageInputRef,
      cardImageInputRef,
      contentImage1InputRef,
      contentImage2InputRef,
    ].forEach((ref) => {
      if (ref.current) ref.current.value = "";
    });
  }, [reset]);

  const renderImageUploadSection = (
    fieldName:
      | "feature_image"
      | "card_image"
      | "content_image1"
      | "content_image2",
    label: string,
    required: boolean,
    selectedImage: string | null,
    setSelectedImage: (value: string | null) => void,
    ref: React.RefObject<HTMLInputElement>,
    currentImage: string | undefined,
    uploadKey: keyof typeof isUploading,
    captionField?: string,
  ) => {
    const isContentImage =
      fieldName === "content_image1" || fieldName === "content_image2";
    const imageUrl = isContentImage
      ? watch(fieldName)?.image
      : watch(fieldName);

    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
          {isUploading[uploadKey] && (
            <span className="ml-2 text-sm text-gray-500">
              Uploading: {uploadProgress[uploadKey]}%
            </span>
          )}
        </label>

        <div>
          <div
            className="border-2 border-dashed rounded-md p-4 text-center border-gray-300 hover:border-gray-400 transition cursor-pointer"
            onClick={() => !isUploading[uploadKey] && triggerFileInput(ref)}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, fieldName, setSelectedImage, currentImage)
              }
              disabled={isUploading[uploadKey]}
              ref={ref}
            />
            <div className="flex flex-col items-center justify-center">
              {selectedImage || imageUrl ? (
                <div className="mb-2 relative h-40 w-full">
                  <Image
                    src={((selectedImage || imageUrl) ?? "").trim()}
                    alt="Preview"
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold text-primary">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG (Max. 5MB)</p>
                </>
              )}
            </div>
          </div>
          {(selectedImage || imageUrl) && (
            <button
              type="button"
              onClick={() => handleRemoveImage(fieldName, setSelectedImage)}
              className="mt-2 text-sm text-red-500 hover:text-red-700"
            >
              Remove Image
            </button>
          )}
        </div>
        {captionField && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <input
              type="text"
              {...register(captionField as any)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition border-gray-300"
              placeholder="Enter image caption"
            />
          </div>
        )}
      </div>
    );
  };

  const renderListInput = (
    name: "learnPoints" | "requirements",
    label: string,
    placeholder: string,
  ) => (
    <div className="space-y-4">
      <label className="block text-sm font-medium mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      {watch(name)?.map((_, index) => (
        <div key={index} className="flex gap-4 group">
          <span className="mt-3 mr-2 w-2 h-2 bg-primary rounded-full block"></span>
          <div className="flex-1">
            <input
              {...register(`${name}.${index}`, {
                required: `${label} cannot be empty`,
              })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                errors[name]?.[index] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={`${placeholder} ${index + 1}`}
            />
            {errors[name]?.[index] && (
              <p className="mt-1 text-sm text-red-600">
                {errors[name]?.[index]?.message}
              </p>
            )}
          </div>
          {watch(name).length > 1 && (
            <button
              type="button"
              onClick={() => {
                const updated = [...watch(name)];
                updated.splice(index, 1);
                setValue(name, updated);
              }}
              className="ml-2 p-2 text-red-500 hover:text-red-700"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setValue(name, [...watch(name), ""])}
        className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
      >
        <FaPlus className="w-3 h-3 mr-1" />
        Add {label}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Create New Blog Post
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "Title is required" })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter blog title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            type="text"
            {...register("slug", { required: "Slug is required" })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
              errors.slug ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter URL slug (e.g., mastering-javascript)"
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            {...register("category", { required: "Category is required" })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
            defaultValue=""
          >
            {categoryOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Sub Title */}
        <div>
          <label
            htmlFor="sub_title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sub Title <span className="text-red-500">*</span>
          </label>
          <input
            id="sub_title"
            type="text"
            {...register("sub_title", { required: "Sub title is required" })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
              errors.sub_title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter a short sub title"
          />
          {errors.sub_title && (
            <p className="mt-1 text-sm text-red-600">
              {errors.sub_title.message}
            </p>
          )}
        </div>

        {/* Feature Image Section */}
        <div className="sm:col-span-2">
          {renderImageUploadSection(
            "feature_image",
            "Feature Image",
            true,
            selectedFeatureImage,
            setSelectedFeatureImage,
            featureImageInputRef,
            featureImageFile,
            "featureImage",
          )}
        </div>

        {/* Card Image Section */}
        <div className="sm:col-span-2">
          {renderImageUploadSection(
            "card_image",
            "Card Image",
            true,
            selectedCardImage,
            setSelectedCardImage,
            cardImageInputRef,
            cardImageFile,
            "cardImage",
          )}
        </div>

        {/* Short Description */}
        <div>
          <label
            htmlFor="short_description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="short_description"
            {...register("short_description", {
              required: "Short description is required",
            })}
            rows={3}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
              errors.short_description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter a short description for the blog card"
          />
          {errors.short_description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.short_description.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <textarea {...field} />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Content Image 1 */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Content Image 1</h3>
          {renderImageUploadSection(
            "content_image1",
            "Image URL",
            false,
            selectedContentImage1,
            setSelectedContentImage1,
            contentImage1InputRef,
            contentImage1?.image,
            "contentImage1",
            "content_image1.caption",
          )}
        </div>

        {/* Content Image 2 */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Content Image 2</h3>
          {renderImageUploadSection(
            "content_image2",
            "Image URL",
            false,
            selectedContentImage2,
            setSelectedContentImage2,
            contentImage2InputRef,
            contentImage2?.image,
            "contentImage2",
            "content_image2.caption",
          )}
        </div>

        {/* Learning Points */}
        {renderListInput("learnPoints", "What You'll Learn", "Learning point")}

        {/* Requirements */}
        <div className="mt-6">
          {renderListInput("requirements", "Requirements", "Requirement")}
        </div>

        {/* Submit Button - Fixed to ensure it's always visible */}
        <div className="sticky bottom-0 bg-green-500 py-4 border-t z-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Blog"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogUploadForm;
