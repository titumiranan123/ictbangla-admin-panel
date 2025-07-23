/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const api_url = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token before sending the request
api_url.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session: any = await getSession();

      if (session?.user?.token) {
        config.headers.Authorization = `Bearer ${session.user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors (token expired or invalid)
api_url.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isBrowser = typeof window !== "undefined";

    if (
      (isBrowser && error.response?.status === 403) 
    ) {
      await signOut({ callbackUrl: "/sign-in" });
    }

    return Promise.reject(error);
  }
);
