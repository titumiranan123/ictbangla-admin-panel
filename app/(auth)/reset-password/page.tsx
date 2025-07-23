/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { api_url } from '@/hooks/apiurl';

type FormData = {
  otp: string;
  password: string;
  confirmPassword: string;
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!email) return;

    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await api_url.post('/v1/auth/password-update/by-top', {
        email,
        otp: data.otp,
        password: data.password,
      });

      toast.success('Password reset successfully');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-[#f9f9fa] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <h3 className="text-lg font-medium text-[#e1242c]">Invalid request</h3>
          <p className="mt-2 text-[#1D2939]">Please request a password reset first</p>
          <Link
            href="/forgot-password"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-[16px] font-medium rounded-md shadow-sm text-white bg-[#1cab55] hover:bg-[#16d43b]"
          >
            Go to forgot password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9fa] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#1D2939]">
          Reset your password
        </h2>
        {name && (
          <p className="mt-2 text-center text-[16px] text-gray-600">
            Hi {name}, enter the OTP sent to {email} and your new password
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="otp" className="block text-[16px] font-medium text-[#1D2939]">OTP</label>
              <input
                id="otp"
                {...register('otp', { required: 'OTP is required' })}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-[16px] focus:ring-[#1cab55] focus:border-[#1cab55]"
              />
              {errors.otp && <p className="text-[#e1242c] text-[16px] mt-1">{errors.otp.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-[16px] font-medium text-[#1D2939]">New Password</label>
              <input
                id="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-[16px] focus:ring-[#1cab55] focus:border-[#1cab55]"
              />
              {errors.password && <p className="text-[#e1242c] text-[16px] mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[16px] font-medium text-[#1D2939]">Confirm New Password</label>
              <input
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match',
                })}
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-[16px] focus:ring-[#1cab55] focus:border-[#1cab55]"
              />
              {errors.confirmPassword && <p className="text-[#e1242c] text-[16px] mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-[16px] font-medium text-white bg-[#1cab55] hover:bg-[#16d43b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1cab55] ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-[16px]">
                <span className="px-2 bg-white text-gray-500">Didn&apos;t receive OTP?</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => router.push('/forgot-password')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-[16px] font-medium text-[#1D2939] bg-white hover:bg-[#f6fef9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1cab55]"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#f9f9fa] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          
          {/* Form Fields Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          
          {/* Button Skeleton */}
          <div className="h-10 bg-gray-200 rounded"></div>
          
          {/* Divider Skeleton */}
          <div className="pt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
            <div className="mt-6 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ResetPasswordContent />
    </Suspense>
  );
}