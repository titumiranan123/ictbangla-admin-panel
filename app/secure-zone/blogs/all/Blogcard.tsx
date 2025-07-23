import Image from "next/image";
import Link from "next/link";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface BlogCardProps {
  id: string;
  title: string;
  short_description: string;
  card_image: string;
  category: string;
  createdAt: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  status?: "published" | "draft";
}

const BlogCard = ({
  id,
  title,
  short_description,
  card_image,
  category,
  createdAt,
  onEdit,
  onDelete,
  status = "published",
}: BlogCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#d1fadf] hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={card_image ?? ""}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {status === "draft" && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Draft
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-[#1cab55] bg-[#f6fef9] px-2 py-1 rounded">
            {category}
          </span>
          <span className="text-xs text-gray-500">{createdAt}</span>
        </div>

        <h3 className="text-lg font-semibold text-[#1D2939] mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {short_description}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center border-t border-[#d1fadf] pt-3">
          <Link
            href={`/blog/${id}`}
            className="text-sm font-medium text-[#1cab55] hover:text-[#16d43b] transition-colors"
          >
            Read More
          </Link>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(id)}
              className="p-2 text-[#1D2939] hover:text-[#1cab55] transition-colors"
              aria-label="Edit blog post"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-2 text-[#1D2939] hover:text-[#e1242c] transition-colors"
              aria-label="Delete blog post"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;