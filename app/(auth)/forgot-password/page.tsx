"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { api_url } from '@/hooks/apiurl';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api_url.post('/v1/auth/password-forget-request', { email });
      if (response.data) {
        toast.success(`OTP sent to ${email}`);
        const query = new URLSearchParams({ email, name: response.data.first_name + response.data.last_name }).toString();
        router.push(`/reset-password?${query}`);
      }
    } catch (error:any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fa] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#1D2939]">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-[16px] text-gray-600">
          Enter your email to receive an OTP
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-[16px] font-medium text-[#1D2939]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1cab55] focus:border-[#1cab55] sm:text-[16px]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-[16px] font-medium text-white bg-[#1cab55] hover:bg-[#16d43b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1cab55] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-[16px]">
                <span className="px-2 bg-white text-gray-500">
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/sign-in"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-[16px] font-medium text-[#1D2939] bg-white hover:bg-[#f6fef9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1cab55]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}