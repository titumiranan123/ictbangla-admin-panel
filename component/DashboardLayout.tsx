"use client";
import MobileSidebar from "@/component/Dashboard/MobileSidebar";
import Sidenav from "@/component/Dashboard/Sidenav";
import ThemeToggle from "@/component/Themetoggole";
import React, { ReactNode, useState } from "react";

const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - Sticky */}
      <div className="sticky top-0 left-0 h-screen">
        <Sidenav open={open} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 w-full bg-green-100 h-[80px] flex justify-between items-center px-2">
          <div
            onClick={() => setOpen(!open)}
            className="flex flex-col mt-2 gap-1 cursor-pointer"
          >
            <span className="bg-black w-5 h-[2px]"></span>
            <span className="bg-black w-5 h-[2px]"></span>
            <span className="bg-black w-5 h-[2px]"></span>
          </div>
          {/* <ThemeToggle /> */}
        </header>

        {/* Page Content */}
        <section className="flex-1 p-4 overflow-y-auto">{children}</section>
      </main>

      {/* Mobile Sidebar */}
      <MobileSidebar open={open} setOpen={setOpen} />
    </div>
  );
};

export default DashboardLayout;
