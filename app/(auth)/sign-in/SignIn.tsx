/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface SignInData {
  email: string;
  password: string;
}

const SignInComponent = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: SignInData) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
        Login: true,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

     toast.success("সফলভাবে লগইন হয়েছে!");
      router.push("/secure-zone");
    } catch (error: any) {
           toast.error(error.message || "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="lg:min-h-screen bg-gradient-to-br from-[#f0fdf4] to-[#f9f9fa] py-12 md:py-24">
      <div className="container mx-auto flex flex-col lg:flex-row justify-center items-center max-w-6xl">
        

        <div className="w-full max-w-xl  h-auto bg-white rounded-r-2xl lg:rounded-l-none rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1a2e35]">আইসিটি বাংলাতে স্বাগতম </h1>
            <p className="mt-2 text-[#4b5563]">
              আপনার কি একাউন্ট নেই ?{" "}
              <Link
                href="/sign-up"
                className="text-[#29AE48] hover:text-[#1a5632] font-medium transition-colors"
              >
                এখনই রেজিস্টার করুন
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-[#374151]">
                আপনার ইমেইল
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "ইমেইল আবশ্যক" })}
                className="w-full px-4 py-3 rounded-lg border border-[#d1d5db] focus:ring-2 focus:ring-[#29AE48] focus:border-[#29AE48] outline-none transition-all"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-sm text-[#dc2626] mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-[#374151]">
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                type="password"
                {...register("password", { required: "পাসওয়ার্ড আবশ্যক" })}
                className="w-full px-4 py-3 rounded-lg border border-[#d1d5db] focus:ring-2 focus:ring-[#29AE48] focus:border-[#29AE48] outline-none transition-all"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-[#dc2626] mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium hover:underline text-[#29AE48] hover:text-[#1a5632]"
                >
                  পাসওয়ার্ড ভুলে গেছেন ?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-[#29AE48] hover:bg-[#1f8a3a] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  লগইন হচ্ছে...
                </>
              ) : (
                "লগ ইন করুন"
              )}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default SignInComponent;
