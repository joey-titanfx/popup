"use client";
import React from "react";
import { Spinner } from "@/components/ui/Spinner";
import { LockKeyhole } from "lucide-react";

const LoadingPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-6">
        <Spinner size="lg" className="fill-primary-600 text-gray-200" />

        {/* Loading text */}
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Opening Secure Window
          </h1>
          <p className="text-sm text-gray-600 mt-2 px-4 text-center">
            Please wait while we redirect you to the bank&apos;s verification
            page...
          </p>
        </div>

        {/* Security notice */}
        <div className="mt-2 max-w-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <LockKeyhole className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-xs text-blue-700">
                You are being redirected to a secure banking portal. Please
                ensure the URL begins with &quot;https://&quot; when redirected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoadingPage;
