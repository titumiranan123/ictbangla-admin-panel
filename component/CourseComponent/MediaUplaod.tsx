interface MediaUploadProps {
    id?:string,
    label?:string,
    accept?:string,
    preview?:string | null
    onFileChange:(file:File)=>void
    onRemove:()=>void
    previewComponent:React.ReactNode
    helpText:string
}
const MediaUpload = ({
  id,
  label,
  accept,
  preview,
  onFileChange,
  onRemove,
  previewComponent,
  helpText,
}: MediaUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div className="">
      <label className="block text-lg font-medium text-black mt-2 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-4 ">
        <label htmlFor={id} className="cursor-pointer flex-1">
          <div className="flex flex-col items-center justify-center p-1 border-2 w-[330px] h-[220px] border-dashed border-gray-300 rounded-md hover:border-gray-400">
            {preview ? (
              <div className="relative group w-full">
                {previewComponent}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-gray-600 mt-2">Click to upload</p>
                <p className="text-xs text-gray-500">{helpText}</p>
              </>
            )}
          </div>
          <input
            id={id}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default MediaUpload;