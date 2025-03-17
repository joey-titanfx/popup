"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle, AlertCircle, XSquare } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

type Status = "idle" | "pending" | "success" | "error" | "cancelled" | "closed";

const DirectPopupPage: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const popupRef = useRef<Window | null>(null);
  const checkClosedIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleDirectPopupOpen = () => {
    setStatus("pending");
    setStatusMessage("Opening verification popup directly...");

    // Create a popup directly from this window (which could be nested in iframes)
    const width = 640;
    const height = 720;

    // Calculate center position
    const screenLeft = window.screenLeft ?? window.screenX;
    const screenTop = window.screenTop ?? window.screenY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const left = screenLeft + windowWidth / 2 - width / 2;
    const top = screenTop + windowHeight / 2 - height / 2;

    // Open popup to loading page first
    popupRef.current = window.open(
      "/loading",
      "PopupWindow",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=no`
    );

    if (!popupRef.current) {
      setStatus("error");
      setStatusMessage("Popup was blocked. Please allow popups for this site.");
      return;
    }

    // Start checking if popup was closed manually
    checkClosedIntervalRef.current = setInterval(() => {
      if (popupRef.current && popupRef.current.closed) {
        clearInterval(checkClosedIntervalRef.current!);
        checkClosedIntervalRef.current = null;

        // Check if we have a stored response (for success/cancel/error cases)
        const response = sessionStorage.getItem("popup_response");
        if (response) {
          try {
            sessionStorage.removeItem("popup_response");
            const data = JSON.parse(response);

            // Handle different response types
            if (data.type === "POPUP_SUCCESS") {
              setStatus("success");
              setStatusMessage(data.data?.message || "Verification successful");
            } else if (data.type === "POPUP_CANCEL") {
              setStatus("cancelled");
              setStatusMessage("Verification cancelled by user");
            } else if (data.type === "POPUP_ERROR") {
              setStatus("error");
              setStatusMessage(data.data?.message || "Verification failed");
            }
          } catch (error) {
            setStatus("error");
            setStatusMessage("Error handling popup response");
          }
        } else {
          // Manual closure without response
          setStatus("closed");
          setStatusMessage("Popup was closed manually");
        }
      }
    }, 100);

    // Redirect to bank page after a short delay
    setTimeout(() => {
      try {
        if (popupRef.current && !popupRef.current.closed) {
          // Add callback URL to the target URL
          const callbackUrl = `${window.location.origin}/success-callback`;
          const targetUrl = `/thirdparty-bank?callback_url=${encodeURIComponent(
            callbackUrl
          )}`;
          popupRef.current.location.href = targetUrl;
        }
      } catch (error) {
        clearInterval(checkClosedIntervalRef.current!);
        checkClosedIntervalRef.current = null;
        setStatus("error");
        setStatusMessage("Failed to redirect popup");
      }
    }, 2000);
  };

  // Set up message listener for direct postMessage from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process messages from our origin
      if (event.origin !== window.location.origin) return;

      const { type, data } = event.data;

      if (type === "POPUP_SUCCESS") {
        setStatus("success");
        setStatusMessage(data?.message || "Verification successful");
      } else if (type === "POPUP_CANCEL") {
        setStatus("cancelled");
        setStatusMessage("Verification cancelled by user");
      } else if (type === "POPUP_ERROR") {
        setStatus("error");
        setStatusMessage(data?.message || "Verification failed");
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      // Clear interval if component unmounts
      if (checkClosedIntervalRef.current) {
        clearInterval(checkClosedIntervalRef.current);
      }
      // Close popup if component unmounts
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

  const StatusIndicator: React.FC<{ status: Status; message: string }> =
    React.memo(({ status, message }) => {
      const getStatusColor = () => {
        switch (status) {
          case "success":
            return "bg-green-100 text-green-800 border-green-200";
          case "error":
            return "bg-red-100 text-red-800 border-red-200";
          case "cancelled":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "closed":
            return "bg-gray-100 text-gray-600 border-gray-200";
          case "pending":
            return "bg-blue-100 text-blue-800 border-blue-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      const getStatusIcon = () => {
        switch (status) {
          case "success":
            return <CheckCircle2 className="w-5 h-5 text-green-500" />;
          case "error":
            return <XCircle className="w-5 h-5 text-red-500" />;
          case "cancelled":
            return <AlertCircle className="w-5 h-5 text-yellow-500" />;
          case "closed":
            return <XSquare className="w-5 h-5 text-gray-500" />;
          case "pending":
            return (
              <Spinner size="sm" className="fill-blue-500 text-blue-100" />
            );
          default:
            return null;
        }
      };

      return status !== "idle" ? (
        <div
          className={`mt-4 p-4 rounded-lg border ${getStatusColor()} flex items-center space-x-2`}
        >
          <div className="flex-shrink-0">{getStatusIcon()}</div>
          <span className="text-sm font-medium">{message}</span>
        </div>
      ) : null;
    });

  StatusIndicator.displayName = "StatusIndicator";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-semibold mb-4">Direct Popup Example</h1>
      <p className="mb-6 text-gray-700 max-w-md text-center">
        This example demonstrates opening a popup directly from a nested iframe,
        without requiring coordination with the parent window.
      </p>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 max-w-md">
        <h2 className="font-semibold text-yellow-800 mb-2">
          When to use this approach:
        </h2>
        <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
          <li>When the iframe needs to open popups independently</li>
          <li>When parent window coordination is not possible</li>
          <li>When working with complex nested iframe structures</li>
        </ul>
      </div>

      <Button
        type="button"
        onClick={handleDirectPopupOpen}
        variant="primary"
        disabled={status === "pending"}
        loading={status === "pending"}
      >
        {status === "pending" ? "Opening Popup..." : "Open Direct Popup"}
      </Button>

      <StatusIndicator status={status} message={statusMessage} />

      <p className="mt-8 text-sm text-gray-500 max-w-md text-center">
        Note: This approach still requires user interaction to prevent popup
        blocking, but doesn't rely on parent window coordination.
      </p>
    </main>
  );
};

export default DirectPopupPage;
