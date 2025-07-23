'use client';

import { useRouter } from 'next/navigation';
import { FiFrown, FiHome, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import Head from 'next/head';

interface ErrorPageProps {
  statusCode?: number;
  errorMessage?: string;
}

export default function ErrorPage({ statusCode, errorMessage }: ErrorPageProps) {
  const router = useRouter();
  
  const errorMessages = {
    404: {
      title: "Page Not Found",
      description: errorMessage || "The lesson you're looking for doesn't exist or has been moved.",
      action: "Browse our courses to find what you need."
    },
    500: {
      title: "Server Error",
      description: errorMessage || "Something went wrong on our end. Our team is working to fix it.",
      action: "Try refreshing the page or come back later."
    },
    403: {
      title: "Access Denied",
      description: errorMessage || "You don't have permission to view this content.",
      action: "Check if you're logged in or contact support."
    },
    default: {
      title: "Oops! Something Went Wrong",
      description: errorMessage || "We encountered an unexpected error while loading your content.",
      action: "Try refreshing the page or navigate back to safety."
    }
  };
  
  const { title, description, action } = errorMessages[statusCode as keyof typeof errorMessages] || errorMessages.default;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] p-4">
      <Head>
        <title>{statusCode ? `${statusCode} - ${title}` : 'Error'} </title>
      </Head>
      
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center border border-gray-100">
        <div className="mb-6">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto">
            <FiFrown className="text-primary text-4xl" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {statusCode && <span className="text-primary">{statusCode} - </span>}
          {title}
        </h1>
        
        <p className="text-gray-600 mb-6">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <FiArrowLeft /> Go Back
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <FiRefreshCw /> Refresh
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors duration-200"
          >
            <FiHome /> Home
          </button>
        </div>
        
        <p className="mt-6 text-sm text-gray-500">
          Need help? <button onClick={() => router.push('/contact')} className="text-[#FF6B4A] hover:underline">Contact support</button>
        </p>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => router.push('/courses')}
          className="text-[#FF6B4A] font-medium hover:underline"
        >
          {action}
        </button>
      </div>
    </div>
  );
}