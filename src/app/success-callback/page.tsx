"use client";
import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const SuccessContent: React.FC = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    const environment = window.opener ? "desktop" : "mobile";

    if (environment === "desktop") {
      window.opener?.postMessage(
        {
          type: "POPUP_SUCCESS",
          data: {
            message: message || "OTP verified successfully",
          },
        },
        "*"
      );

      setTimeout(() => window.close(), 500);
    } else {
    }
  }, [searchParams]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-green-800">
          Verification Successful
        </h1>
        <p className="text-green-600">Completing your request...</p>
      </div>
    </main>
  );
};

const SuccessCallbackPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessCallbackPage;
