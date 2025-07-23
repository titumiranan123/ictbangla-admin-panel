'use client'
import React from "react";
import { FaX } from "react-icons/fa6";
import {  FaChalkboardTeacher, FaCog, FaHome, FaPowerOff, FaUserGraduate, FaBook, FaPlusCircle, FaListUl, FaTags, FaMoneyBillWave, FaChevronDown, FaChevronRight, FaShoppingBag, FaChartLine } from "react-icons/fa";
import logo from "@/public/assets/logo.png";
import CustomLink from "../../utils/CustomLink";
import Image from "next/image";
import { signOut } from "next-auth/react";

// Dashboard and Main Routes
const mainLinks = [
  { title: "Dashboard", href: "/secure-zone", icon: <FaHome className="text-green-600" /> },
  {
    title: "All Orders",
    href: "/secure-zone/orders",
    icon: <FaShoppingBag className="text-green-600" />,
  },
  {
    title: "Users",
    href: "/secure-zone/all-users",
    icon: <FaUserGraduate className="text-green-600" />,
  },
  {
    title: "Blogs",
    href: "/secure-zone/blogs/all",
    icon: <FaBook className="text-green-600" />,
  },
  {
    title: "Instructors",
    href: "/secure-zone/instructors",
    icon: <FaChalkboardTeacher className="text-green-600" />,
  },
  {
    title: "Analytics",
    href: "/secure-zone/analytics",
    icon: <FaChartLine className="text-green-600" />,
  },
  {
    title: "Settings",
    href: "/secure-zone/settings",
    icon: <FaCog className="text-green-600" />,
  },
];

// Course Management Routes
const courseLinks = [
  {
    title: "All Courses",
    href: "/secure-zone/course/list",
    icon: <FaBook className="text-green-600" />,
  },
  {
    title: "Add New Course",
    href: "/secure-zone/course/create",
    icon: <FaPlusCircle className="text-green-600" />,
  },
  {
    title: "Free Courses",
    href: "/secure-zone/course/free",
    icon: <FaTags className="text-green-600" />,
  },
  {
    title: "Paid Courses",
    href: "/secure-zone/course/paid",
    icon: <FaMoneyBillWave className="text-green-600" />,
  },
  {
    title: "Static Course",
    href: "/secure-zone/course/static",
    icon: <FaListUl className="text-green-600" />,
  },
];

// Auth or Utility Routes
const utilityLinks = [
  {
    title: "Logout",
    icon: <FaPowerOff className="text-red-500" />,
  },
];

const MobileSidebar: React.FC<{ open: boolean; setOpen: (p: boolean) => void }> = ({
  open,
  setOpen,
}) => {
  const [expandedSections, setExpandedSections] = React.useState({
    main: true,
    courses: true,
  });

  const toggleSection = (section: "main" | "courses") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div
      className={`${
        !open ? "translate-x-0" : "-translate-x-full"
      } fixed inset-0 z-50 transition-transform duration-300 ease-in-out lg:hidden`}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/30"
        onClick={() => setOpen(!open)}
      />
      
      {/* Sidebar Content */}
      <div className="relative max-w-xs w-full h-full bg-green-50 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 z-50"
          aria-label="Close menu"
        >
          <FaX className="text-green-700" />
        </button>
        
        {/* Sidebar Inner Content */}
        <div className="flex flex-col h-full p-4">
          {/* Logo Area */}
          <div className="mb-8 p-4 flex items-center justify-center bg-green-100 rounded-xl">
            <Image src={logo} alt="logo" className="w-44 h-auto" />
          </div>

          {/* Main Navigation */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full px-4 py-3 mb-1 cursor-pointer rounded-xl hover:bg-green-100 transition focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              onClick={() => toggleSection("main")}
              aria-expanded={expandedSections.main}
            >
              <p className="text-sm font-semibold text-green-800 tracking-wider">
                MAIN MENU
              </p>
              {expandedSections.main ? (
                <FaChevronDown className="text-green-600 text-xs" />
              ) : (
                <FaChevronRight className="text-green-600 text-xs" />
              )}
            </button>
            {expandedSections.main && (
              <div className="flex flex-col gap-1 pl-2">
                {mainLinks.map((link,idx) => (
                  <button  key={idx} onClick={() => setOpen(!open)}>

                    <CustomLink
                      key={link.href}
                      title={link.title}
                      href={link.href}
                      icon={link.icon}
                      className="rounded-xl hover:bg-green-200 transition-all text-green-800 font-medium hover:text-green-900 hover:pl-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                      style={{ padding: "12px 16px" }}
                     
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Course Navigation */}
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full px-4 py-3 mb-1 cursor-pointer rounded-xl hover:bg-green-100 transition focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              onClick={() => toggleSection("courses")}
              aria-expanded={expandedSections.courses}
            >
              <p className="text-sm font-semibold text-green-800 tracking-wider">
                COURSES
              </p>
              {expandedSections.courses ? (
                <FaChevronDown className="text-green-600 text-xs" />
              ) : (
                <FaChevronRight className="text-green-600 text-xs" />
              )}
            </button>
            {expandedSections.courses && (
              <div className="flex flex-col gap-1 pl-2">
                {courseLinks.map((link,idx) => (
                  <button key={idx}   onClick={() => setOpen(!open)}>

                    <CustomLink
                      key={link.href}
                      title={link.title}
                      href={link.href}
                      icon={link.icon}
                      className="rounded-xl hover:bg-green-200 transition-all text-green-800 font-medium hover:text-green-900 hover:pl-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                      style={{ padding: "12px 16px" }}
                   
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Utility */}
          <div className="mt-auto mb-4">
            <div className="flex flex-col gap-1">
              {utilityLinks.map((link, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-3 rounded-xl hover:bg-red-100 transition-all text-red-600 font-medium hover:text-red-700 hover:pl-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                  style={{ padding: "12px 16px" }}
                  onClick={() => signOut()}
                >
                  {link.icon}
                  {link.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;