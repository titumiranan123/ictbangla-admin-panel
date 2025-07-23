/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Image from "next/image";
import CreatableSelect from "react-select/creatable";
import MediaUpload from "./MediaUplaod";
import VideoUpload from "./Videouplaod";
import { RootState } from "@/redux/store";
import { setMedia, setSEO } from "@/redux/features/courseSlice";

interface IFormData {
  media: {
    video: string | null;
    thumbnail: File | null;
    temp_img: string;
    temp_video: string;
  };
  seo: {
    description: string;
    keywords: string[];
  };
}

const MediaSEOForm = ({
  setActiveTab,
}: {
  setActiveTab: (label: string) => void;
}) => {
  const { media, seo } = useSelector((state: RootState) => state?.course);
  const [videoId, setVideoId] = useState(media.video || "");
  const [imagePreview, setImagePreview] = useState<string | null>(
    media.temp_img || ""
  );
  const [videoPreview, setVideoPreview] = useState<string | null>(
    media.temp_video || ""
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      media: { ...media },
      seo: { ...seo },
    },
  });

  const dispatch = useDispatch();

  const onSubmit = async (data: IFormData) => {
    dispatch(
      setMedia({
        videoId: videoId,
        thumbnail: imageFile,
        temp_video: videoPreview || "",
      })
    );
    dispatch(
      setSEO({ description: data.seo.description, keywords: data.seo.keywords })
    );
    setActiveTab("Info");
  };

  const handleTagsChange = (newValue: any) => {
    setValue(
      "seo.keywords",
      newValue.map((item: any) => item.value)
    );
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    dispatch(setMedia({ temp_img: imageUrl }));
    setImagePreview(imageUrl);
    setValue("media.thumbnail", file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    dispatch(setMedia({thumbnail:null}))
    setValue("media.thumbnail", null, { shouldValidate: true });
  };

  return (
    <div className="w-full relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Media & SEO Settings</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Media Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Thumbnail Upload */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <MediaUpload
              id="image-upload"
              label="Thumbnail *"
              accept="image/*"
              preview={imagePreview}
              onFileChange={handleImageUpload}
              onRemove={handleRemoveImage}
              previewComponent={
                <div className="relative h-48 w-full bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <span className="text-gray-400">No thumbnail selected</span>
                  )}
                </div>
              }
              helpText="JPG, PNG, WEBP up to 5MB"
            />
          </div>

          {/* Video Upload */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <VideoUpload
              setVideoId={setVideoId}
              videoId={videoId}
              videoPreview={videoPreview}
              setVideoPreview={setVideoPreview}
            />
          </div>
        </div>

        {/* SEO Section */}
        <div className="space-y-6">
          {/* SEO Description */}
          <Controller
            name="seo.description"
            control={control}
            rules={{ required: "SEO Description is required" }}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...field}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.seo?.description
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-green-300 focus:border-green-500"
                  }`}
                  placeholder="Enter SEO description for better search visibility..."
                />
                {errors.seo?.description && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.seo.description.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* SEO Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Keywords
            </label>
            <Controller
              name="seo.keywords"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  isMulti
                  onChange={handleTagsChange}
                  options={[]}
                  value={field.value?.map((keyword) => ({
                    value: keyword,
                    label: keyword,
                  }))}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Type and press enter to add keywords..."
                  noOptionsMessage={() => "Type to create keywords"}
                  formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: errors.seo?.keywords ? '#ef4444' : '#d1d5db',
                      '&:hover': {
                        borderColor: errors.seo?.keywords ? '#ef4444' : '#9ca3af',
                      },
                      '&:focus-within': {
                        borderColor: errors.seo?.keywords ? '#ef4444' : '#10b981',
                        boxShadow: errors.seo?.keywords 
                          ? '0 0 0 2px rgba(239, 68, 68, 0.2)' 
                          : '0 0 0 2px rgba(16, 185, 129, 0.2)',
                      },
                      minHeight: '44px',
                      borderRadius: '0.5rem',
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#10b981',
                      color: 'white',
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: 'white',
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: 'white',
                      ':hover': {
                        backgroundColor: '#059669',
                      },
                    }),
                  }}
                />
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm"
          >
            Save & Continue to Info
          </button>
        </div>
      </form>
    </div>
  );
};

export default MediaSEOForm;