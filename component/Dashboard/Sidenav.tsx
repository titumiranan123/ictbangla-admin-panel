import React from "react";
import {
  FaChalkboardTeacher,
  FaCog,
  FaHome,
  FaPowerOff,
  FaUserGraduate,
  FaBook,
  FaPlusCircle,
  FaListUl,
  FaTags,
  FaMoneyBillWave,
  FaChevronDown,
  FaChevronRight,
  FaShoppingBag,
  FaChartLine,
} from "react-icons/fa";

import logo from "@/public/assets/logo.png";
import CustomLink from "../../utils/CustomLink";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { FaPhone } from "react-icons/fa6";

// Dashboard and Main Routes
const mainLinks = [
  {
    title: "Dashboard",
    href: "secure-zone",
    icon: <FaHome className="text-green-600" />,
  },
  {
    title: "All Orders",
    href: "secure-zone/orders",
    icon: <FaShoppingBag className="text-green-600" />,
  },
  {
    title: "Number Lead",
    href: "secure-zone/course-lead-number",
    icon: <FaPhone className="text-green-600" />,
  },
  {
    title: "Users",
    href: "secure-zone/all-users",
    icon: <FaUserGraduate className="text-green-600" />,
  },
  {
    title: "All Agent",
    href: "secure-zone/agent/list",
    icon: <FaUserGraduate className="text-green-600" />,
  },
  {
    title: "Blogs",
    href: "secure-zone/blogs/all",
    icon: <FaBook className="text-green-600" />,
  },
  {
    title: "Instructors",
    href: "secure-zone/instructors",
    icon: <FaChalkboardTeacher className="text-green-600" />,
  },
  {
    title: "Analytics",
    href: "secure-zone/analytics",
    icon: <FaChartLine className="text-green-600" />,
  },
  {
    title: "Settings",
    href: "secure-zone/settings",
    icon: <FaCog className="text-green-600" />,
  },
];

// Course Management Routes
const courseLinks = [
  {
    title: "All Courses",
    href: "secure-zone/course/list",
    icon: <FaBook className="text-green-600" />,
  },
  {
    title: "Course Category ",
    href: "secure-zone/course/category",
    icon: <FaPlusCircle className="text-green-600" />,
  },
  {
    title: "Add New Course",
    href: "secure-zone/course/create",
    icon: <FaPlusCircle className="text-green-600" />,
  },
  {
    title: "Coupon",
    href: "secure-zone/coupon",
    icon: <FaTags className="text-green-600" />,
  },
  {
    title: "Static Course",
    href: "secure-zone/courses/static",
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

const Sidenav: React.FC<{ open: boolean }> = ({ open }) => {
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
    <nav
      className={`bg-green-50 lg:block hidden transition-all duration-300 h-screen overflow-y-scroll border-r border-green-100 ${
        open ? "w-[300px] p-4" : "w-0"
      }`}
    >
      {open && (
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="mb-8 p-4 flex items-center justify-center bg-green-100 rounded-xl">
            <Image src={logo} alt="logo" className="w-44 h-auto" />
          </div>

          {/* Main Navigation */}
          <div className="mb-6">
            <div
              className="flex items-center justify-between px-4 py-3 mb-1 cursor-pointer rounded-xl hover:bg-green-100 transition"
              onClick={() => toggleSection("main")}
            >
              <p className="text-sm font-semibold text-green-800 tracking-wider">
                MAIN MENU
              </p>
              {expandedSections.main ? (
                <FaChevronDown className="text-green-600 text-xs" />
              ) : (
                <FaChevronRight className="text-green-600 text-xs" />
              )}
            </div>
            {expandedSections.main && (
              <div className="flex flex-col gap-1 pl-2">
                {mainLinks.map((link) => (
                  <CustomLink
                    key={link.href}
                    title={link.title}
                    href={link.href}
                    icon={link.icon}
                    className="rounded-xl hover:bg-green-200 transition-all text-green-800 font-medium hover:text-green-900 hover:pl-3"
                    style={{ padding: "12px 16px" }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Course Navigation */}
          <div className="mb-6">
            <div
              className="flex items-center justify-between px-4 py-3 mb-1 cursor-pointer rounded-xl hover:bg-green-100 transition"
              onClick={() => toggleSection("courses")}
            >
              <p className="text-sm font-semibold text-green-800 tracking-wider">
                COURSES
              </p>
              {expandedSections.courses ? (
                <FaChevronDown className="text-green-600 text-xs" />
              ) : (
                <FaChevronRight className="text-green-600 text-xs" />
              )}
            </div>
            {expandedSections.courses && (
              <div className="flex flex-col gap-1 pl-2">
                {courseLinks.map((link) => (
                  <CustomLink
                    key={link.href}
                    title={link.title}
                    href={link.href}
                    icon={link.icon}
                    className="rounded-xl hover:bg-green-200 transition-all text-green-800 font-medium hover:text-green-900 hover:pl-3"
                    style={{ padding: "12px 16px" }}
                  />
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
                  className="rounded-xl hover:bg-red-100 transition-all text-red-600 font-medium hover:text-red-700 hover:pl-3"
                  style={{ padding: "12px 16px" }}
                  onClick={() => signOut()}
                >
                  {link.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Sidenav;
