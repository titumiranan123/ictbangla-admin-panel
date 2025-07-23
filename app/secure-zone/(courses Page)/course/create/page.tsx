"use client";

import BasicInfo from "@/component/CourseComponent/BasicInfo";
import CourseInfo from "@/component/CourseComponent/Coureseinfo";
import Coursepricing from "@/component/CourseComponent/Coursepricing";
import MediaSEOForm from "@/component/CourseComponent/MediaSeo";
import Tab from "@/component/shared/Tab";


import React, { useState } from "react";
const CreateCourse = () => {
  const [activeTab, setActiveTab] = useState("Basic Info");

  const tabData = [
    { label: "Basic Info", content: <BasicInfo setActiveTab={setActiveTab} /> },
    {
      label: "Media & Seo",
      content: <MediaSEOForm setActiveTab={setActiveTab} />,
    },
    { label: "Info", content: <CourseInfo setActiveTab={setActiveTab} /> },
    {
      label: "Pricing",
      content: <Coursepricing />,
    },
  ];
  return (
    <div>
      <Tab
        tabs={tabData}
        isClickable={true}
        isTabCenter={false}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default CreateCourse;
