'use client'
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState, DragEvent } from "react";
import { FiUpload, FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const PARALLEL_CHUNK_COUNT = 3;
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/v1/website`;

interface UploadStatus {
  type: "info" | "success" | "error";
  message: string;
}

interface HomeProps {
  videoId: string | null;
  setVideoId: (id: string) => void;
  videoPreview: string | null;
  setVideoPreview: (id: string|null) => void;
}

interface InitiateResponse {
  uploadId: string;
  videoId: string;
}

const VideoUpload: React.FC<HomeProps> = ({ videoId, setVideoId, setVideoPreview, videoPreview }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const videoUrl = URL.createObjectURL(e.target.files[0]);
      setVideoPreview(videoUrl);
      setFile(e.target.files[0]);
      setProgress(0);
      setUploadStatus(null);
    }
  };

  const handleRemovePreview = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    setFile(null);
    setProgress(0);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const videoUrl = URL.createObjectURL(e.dataTransfer.files[0]);
      setVideoPreview(videoUrl);
      setFile(e.dataTransfer.files[0]);
      setProgress(0);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({
        type: "error",
        message: "Please select a file",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setUploadStatus({
        type: "error",
        message: "Please select a video file",
      });
      return;
    }

    setUploading(true);
    setUploadStatus({
      type: "info",
      message: "Initiating upload...",
    });

    try {
      // Step 1: Initiate multipart upload
      const initiateRes: AxiosResponse<InitiateResponse> = await axios.post(
        `${BASE_URL}/uploadVideo/initiate`,
        { fileName: file.name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { uploadId, videoId: newVideoId } = initiateRes.data;
      setVideoId(newVideoId);
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      
      setUploadStatus({
        type: "info",
        message: `Uploading ${totalChunks} parts...`,
      });

      // Step 2: Upload chunks in parallel batches
      for (let i = 1; i <= totalChunks; i += PARALLEL_CHUNK_COUNT) {
        const promises: Promise<AxiosResponse>[] = [];

        for (let j = 0; j < PARALLEL_CHUNK_COUNT; j++) {
          const partNumber = i + j;
          if (partNumber > totalChunks) break;

          const start = (partNumber - 1) * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);


          const formData = new FormData();
          formData.append("file", chunk, `chunk-${partNumber}`);
          formData.append("videoId", newVideoId);
          formData.append("partNumber", partNumber.toString());
          formData.append("uploadId", uploadId);

          const uploadPromise = axios.post(
            `${BASE_URL}/uploadVideo/upload-part`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 60000 * 3,
            }
          );

          promises.push(uploadPromise);
        }

        // Wait for current batch to complete
        try {
          await Promise.all(promises);
          const completedChunks = Math.min(
            i + PARALLEL_CHUNK_COUNT - 1,
            totalChunks
          );
          const progressPercent = Math.round(
            (completedChunks / totalChunks) * 100
          );
          setProgress(progressPercent);
          // console.log(
          //   `Completed ${completedChunks}/${totalChunks} chunks (${progressPercent}%)`
          // );
        } catch (batchError) {
          console.error(`Error in batch starting at chunk ${i}:`, batchError);
          throw batchError;
        }
      }

      setUploadStatus({
        type: "info",
        message: "Finalizing upload...",
      });

      // Step 3: Complete multipart upload
      await axios.post(
        `${BASE_URL}/uploadVideo/complete`,
        { videoId: newVideoId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUploadStatus({
        type: "success",
        message: "Upload completed successfully!",
      });
      setProgress(100);
    } catch (err) {
      const error = err as AxiosError | Error;
      console.error("Upload error:", error);

      let errorMessage = "Upload Failed";
      if (axios.isAxiosError(error)) {
        errorMessage = `Upload Failed: ${
          error.response?.data?.error || error.response?.statusText
        }`;
      } else if (error instanceof Error) {
        errorMessage = `Upload Failed: ${error.message}`;
      }

      setUploadStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <p className="md:text-lg text-sm text-gray-800 mb-1 flex items-center">
        Video Upload *
      </p>
      {videoId && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-700">
            Video ID: <span className="font-mono">{videoId}</span>
          </p>
        </div>
      )}

      {/* Video Preview Section */}
      {videoPreview && (
        <div className="mb-4 relative">
          <div className="relative w-full max-w-[500px] h-auto rounded-lg overflow-hidden">
            <video
              controls
              src={videoPreview}
              className="w-full h-auto"
            />
            <button
              onClick={handleRemovePreview}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-100 transition-all"
              aria-label="Remove video"
            >
              <FiX size={18} />
            </button>
          </div>
          {file && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">{file.name}</p>
              <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Area (only shown when no preview is available) */}
      {!videoPreview && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors w-[330px] h-[200px] ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <FiUpload className="text-3xl text-gray-400 mb-3" />
            <p className="text-gray-600 mb-2">
              Drag & drop your video here
            </p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <label className="cursor-pointer">
              <span className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Browse Files
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Progress bar (shown when uploading) */}
      {file && videoPreview && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className={`w-[180px] h-[20px] py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
          uploading || !file
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {uploading ? (
          <>
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
            Uploading {progress}%
          </>
        ) : (
          <>
            <FiUpload className="mr-2" />
            Upload Video
          </>
        )}
      </button>

      {uploadStatus && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            uploadStatus.type === "error"
              ? "bg-red-50 border border-red-200"
              : uploadStatus.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <div className="flex items-center">
            {uploadStatus.type === "error" ? (
              <FiAlertCircle className="text-red-500 mr-2" />
            ) : uploadStatus.type === "success" ? (
              <FiCheckCircle className="text-green-500 mr-2" />
            ) : (
              <svg
                className="animate-spin h-5 w-5 text-blue-500 mr-2"
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
            )}
            <span
              className={`${
                uploadStatus.type === "error"
                  ? "text-red-700"
                  : uploadStatus.type === "success"
                  ? "text-green-700"
                  : "text-blue-700"
              }`}
            >
              {uploadStatus.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;