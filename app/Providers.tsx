/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Aos from "aos";
import "aos/dist/aos.css";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
const queryClient = new QueryClient();
const Providers = ({ children }: any) => {
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
      offset: 80,
      easing: "ease",
    });
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SessionProvider> {children}</SessionProvider>
      </Provider>
      <Toaster />
    </QueryClientProvider>
  );
};

export default Providers;
