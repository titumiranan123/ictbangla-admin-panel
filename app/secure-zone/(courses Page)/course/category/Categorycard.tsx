import Image from "next/image";
import React from "react";
interface props {
  data: {
    _id: string;
    title: string;
    slug: string;
    isParent: boolean;
    image: string;
    icon: string;
    parentId: string | null;
  };
  setOpenModal: (p: boolean) => void;
  setEditData: (p: any) => void;
}
const Categorycard: React.FC<props> = ({ data, setEditData, setOpenModal }) => {
  return (
    <div className="max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        {/* <Image
          src={data?.image}
          alt={data?.title}
          className="object-cover w-full h-full"
          priority
          width={400}
          height={200}
        /> */}
        {/* Parent Badge */}
        {data?.isParent && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            Parent Category
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex items-center mb-3">
          {/* Icon */}
          <div className="flex-shrink-0 mr-3">
            {/* <Image
              src={data?.icon}
              alt="Icon"
              className="w-10 h-10"
              priority
              width={40}
              height={40}
            /> */}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800">{data?.title}</h3>
        </div>

        <button
          onClick={() => {
            setOpenModal(true);
            setEditData(data);
          }}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
      </div>
    </div>
  );
};

export default Categorycard;
