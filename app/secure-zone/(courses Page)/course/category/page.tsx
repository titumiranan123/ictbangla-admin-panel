"use client";
import useCategory from "@/hooks/useCategory";
import React, { useState } from "react";
import Categorycard from "./Categorycard";
import CategoryFrom from "./CategoryFrom";
import { FaCross } from "react-icons/fa6";

const Category = () => {
  const { data, isLoading } = useCategory();
  const [editData, setEditData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((dt: any) => (
          <Categorycard
            setEditData={setEditData}
            setOpenModal={setOpenModal}
            data={dt}
            key={dt._id}
          />
        ))}
      </div>
      {openModal && (
        <div className="w-full h-screen bg-black/20 backdrop-blur-sm fixed inset-0 z-20 flex justify-center items-center">
            <div onClick={()=>setOpenModal(false)} className="fixed cursor-pointer top-[14%] right-[30%]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 6L6 18M6 6L18 18" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
</svg>
            </div>
            <CategoryFrom />
        </div>
      )}

    </div>
  );
};

export default Category;
