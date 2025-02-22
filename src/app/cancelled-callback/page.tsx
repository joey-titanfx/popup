"use client";
import React, { Suspense, useEffect } from "react";

const CancelContent: React.FC = () => {
  useEffect(() => {
    const environment = window.opener ? "desktop" : "mobile";

    const cancelResponse = {
      type: "POPUP_CANCEL",
      data: {
        message: "Operation cancelled by user",
      },
    };

    if (environment === "desktop") {
      window.opener?.postMessage(cancelResponse, "*");
      setTimeout(() => window.close(), 500);
    } else {
      sessionStorage.setItem("popup_response", JSON.stringify(cancelResponse));
      setTimeout(() => window.close(), 100);
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Operation Cancelled
        </h1>
        <p className="text-gray-600">Closing window...</p>
      </div>
    </main>
  );
};

const CancelledCallbackPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  );
};

export default CancelledCallbackPage;
