/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { FaPlus } from "react-icons/fa";
import BlogCardSkeleton from "./Blogskeleton";
import BlogCard from "./Blogcard";
import useUserBlog from "@/hooks/useUserBlog";
import Link from "next/link";

const Bloglist = () => {
  const { data, isLoading } = useUserBlog();
  const handleEdit = (id: string) => {
    return id
  };

  const handleDelete = (id: string) => {
return id    
  };
  return (
    <div className="p-5">
      <div className="flex justify-end items-center">
        <Link href={'/blogs/create'} className="flex justify-center items-center">
          <FaPlus />
          Create Blog
        </Link>
      </div>
      <div>
        {isLoading
          ? [...Array(6)].map((_, idx) => <BlogCardSkeleton key={idx} />)
          : data?.bols?.map((blog:any, idx:number) => (
              <BlogCard
                card_image={blog?.card_image}
                category={blog?.category}
                id={blog?._id}
                createdAt={blog?.createdAt}
                short_description={blog?.short_description}
                status={blog?.status}
                onDelete={handleDelete}
                onEdit={handleEdit}
                title={blog?.title}
                key={idx}
              />
            ))}
      </div>
    </div>
  );
};

export default Bloglist;
