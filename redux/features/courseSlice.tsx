/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

interface ICourse {
  basicInfo: {
    title: string;
    slug: string;
    short_description: string;
    description: string;
    category: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT/SPECIALIZED";
    status: "PENDING" | "PUBLISHED" | "UPCOMING" | "REJECTED";
    topCourse: boolean;
  };
  info: {
    faq: { question: string; answer: string }[];
    requirement: {
      category: "point" | "paragraph" | "question";
      question?: { question: string; answer?: string }[];
      point?: string[];
      paragraph?: string;
    };
    outcomes: {
      category: "point" | "paragraph" | "question";
      question?: { question: string; answer?: string }[];
      point?: string[];
      paragraph?: string;
    };
    sections: [];
  };
  pricing: {
    isFree: boolean;
    price: {
      main: number;
      isDiscount: boolean;
      discount: number;
      percentage: number;
    };
    expiry: {
      status: boolean;
      date: string | null;
    };
  };
  media: {
    video: string | null;
    videoId ?:any
    thumbnail: File | null;
    temp_img?:string;
    temp_video?:string
  };
  seo: {
    description: string;
    keywords: string[];
  };
}
const initialState: ICourse = {
  basicInfo: {
    title: "",
    slug: "",
    short_description: "",
    description: "",
    category: "",
    level: "BEGINNER",
    status: "PENDING",
    topCourse: false,
  },
  info: {
    faq: [],
    requirement: {
      category: "point",
      question: [],
      point: [],
      paragraph: "",
    },
    outcomes: {
      category: "point",
      question: [],
      point: [],
      paragraph: "",
    },
    sections: [],
  },
  pricing: {
    isFree: false,
    price: { main: 0, isDiscount: false, discount: 0, percentage: 0 },
    expiry: { status: false, date: null },
  },
  media: {
    videoId:'',
    video: null,
    thumbnail: null,
  },
  seo: {
    description: "",
    keywords: [],
  },
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourse: (state, action: PayloadAction<Partial<ICourse>>) => {
      return {
        ...state,
        ...action.payload,
        basicInfo: {
          ...state.basicInfo,
          ...action.payload.basicInfo,
        },
        info: {
          ...state.info,
          ...action.payload.info,
          requirement: {
            ...state.info.requirement,
            ...action.payload.info?.requirement,
          },
          outcomes: {
            ...state.info.outcomes,
            ...action.payload.info?.outcomes,
          },
        },
        pricing: {
          ...state.pricing,
          ...action.payload.pricing,
          price: {
            ...state.pricing.price,
            ...action.payload.pricing?.price,
          },
          expiry: {
            ...state.pricing.expiry,
            ...action.payload.pricing?.expiry,
          },
        },
        media: {
          ...state.media,
          ...action.payload.media,
        },
        seo: {
          ...state.seo,
          ...action.payload.seo,
        },
      };
    },
    setBasicInfo: (
      state,
      action: PayloadAction<Partial<ICourse["basicInfo"]>>
    ) => {
      state.basicInfo = { ...state.basicInfo, ...action.payload };
    },
    setInfo: (state, action: PayloadAction<Partial<ICourse["info"]>>) => {
      state.info = { ...state.info, ...action.payload };
    },
    setPricing: (state, action: PayloadAction<Partial<ICourse["pricing"]>>) => {
      state.pricing = { ...state.pricing, ...action.payload };
    },
    setMedia: (state, action: PayloadAction<Partial<ICourse["media"]>>) => {
      state.media = { ...state.media, ...action.payload };
    },
    setSEO: (state, action: PayloadAction<Partial<ICourse["seo"]>>) => {
      state.seo = { ...state.seo, ...action.payload };
    },
    resetCourse: () => initialState,
  },
});

export const {
  setCourse,
  setBasicInfo,
  setInfo,
  setPricing,
  setMedia,
  setSEO,
  resetCourse,
} = courseSlice.actions;

export default courseSlice.reducer;
