"use client";
import React from "react";

interface TabItem {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  isTabCenter?: boolean;
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (label: string) => void;
  isLoading?: boolean;
  isClickable?: boolean;
}

const Tab: React.FC<TabsProps> = ({
  tabs,
  isTabCenter = false,
  activeTab,
  setActiveTab,
  isLoading = false,
  isClickable = true,
}) => {
  return (
    <div className="w-full h-auto">
      <div
        className={`flex flex-wrap gap-3 lg:pt-0 pt-5 ${
          isTabCenter ? "justify-center" : "justify-start"
        } items-center border-b border-gray-200`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.label}
            disabled={tab.disabled || isLoading}
            className={`
              relative px-4 py-2 md:text-[18px] text-[15px] font-medium
              transition-all duration-200 ease-in-out
              rounded-t-lg mx-1
              ${
                activeTab === tab.label
                  ? "text-white bg-green-600 shadow-md"
                  : "text-gray-700 hover:text-green-700 hover:bg-green-50"
              }
              ${
                (tab.disabled || isLoading)
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
              group relative overflow-hidden
            `}
            onClick={() => isClickable && !isLoading && setActiveTab(tab.label)}
          >
            {tab.label}
            
            {/* Active tab indicator (red for contrast) */}
            {activeTab === tab.label && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"></div>
            )}
            
            {/* Hover effect for inactive tabs */}
            {activeTab !== tab.label && (
              <div className="absolute inset-0 bg-green-100 opacity-0 group-hover:opacity-30 transition-opacity duration-200"></div>
            )}
          </button>
        ))}
      </div>
      
      <div className="p-5 bg-white rounded-b-lg shadow-sm">
        {tabs.find((t) => t.label === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tab;