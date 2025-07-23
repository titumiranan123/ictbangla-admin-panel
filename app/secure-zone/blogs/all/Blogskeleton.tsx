import { FiEdit2, FiTrash2 } from "react-icons/fi";

const BlogCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#d1fadf] animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-48 w-full bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-medium bg-gray-200 text-transparent px-2 py-1 rounded">
            Loading category
          </span>
          <span className="text-xs bg-gray-200 text-transparent px-2 py-1 rounded">
            Loading date
          </span>
        </div>

        <h3 className="text-lg font-semibold bg-gray-200 text-transparent mb-3 h-6 rounded"></h3>
        <div className="space-y-2 mb-4">
          <p className="text-sm bg-gray-200 text-transparent h-4 rounded"></p>
          <p className="text-sm bg-gray-200 text-transparent h-4 rounded"></p>
          <p className="text-sm bg-gray-200 text-transparent h-4 rounded w-2/3"></p>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex justify-between items-center border-t border-[#d1fadf] pt-3">
          <span className="text-sm font-medium bg-gray-200 text-transparent px-3 py-1 rounded">
            Read More
          </span>

          <div className="flex space-x-2">
            <button className="p-2 text-gray-200" aria-label="Edit blog post">
              <FiEdit2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-200" aria-label="Delete blog post">
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;