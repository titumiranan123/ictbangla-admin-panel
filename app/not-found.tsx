import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-6">
          {/* Animated 404 Number */}
          <div className="relative">
            <span className="text-9xl font-bold text-gray-900 opacity-10">404</span>
            <h1 className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-gray-900">
              Page Not Found
            </h1>
          </div>

          {/* Main Message */}
          <h2 className="text-2xl font-medium text-gray-800">
            Oops! You've wandered off the path
          </h2>
          
          <p className="text-gray-600">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back on track.
          </p>
        </div>

        {/* Primary Action */}
        <div className="pt-6">
          <Link
            href="/secure-zone"
            className="group relative w-full flex justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-lg text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
          >
            Return to Homepage
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
              &rarr;
            </span>
          </Link>
        </div>

        {/* Secondary Options */}
        <div className="pt-8">
          <p className="text-sm text-gray-500">
            Still need help? Try these options:
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link
              href="/search"
              className="text-green-500 hover:text-green-600 font-medium text-sm hover:underline"
            >
              Search our site
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/contact"
              className="text-green-500 hover:text-green-600 font-medium text-sm hover:underline"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}