"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle, AlertCircle, XSquare } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

type Status = "idle" | "pending" | "success" | "error" | "cancelled" | "closed";

const ExternalDepositPage: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const updateStatus = useCallback((newStatus: Status, message: string) => {
    setStatus(newStatus);
    setStatusMessage(message);
  }, []);

  const handleMessage = (event: MessageEvent) => {
    const { type, data, error } = event.data;
    switch (type) {
      case "OTP_VERIFIED":
        updateStatus("success", data.message || "OTP verified successfully");
        break;
      case "OTP_CANCELLED":
        const isCancelled = data?.message === "Tab closed by user";
        updateStatus(
          isCancelled ? "closed" : "cancelled",
          isCancelled
            ? "Verification window was closed"
            : "Verification cancelled"
        );
        break;
      case "OTP_ERROR":
        updateStatus("error", error || "OTP verification failed");
        break;
    }
  };

  const memoizedHandleMessage = useCallback(handleMessage, [handleMessage]);

  React.useEffect(() => {
    window.addEventListener("message", memoizedHandleMessage);
    return () => {
      window.removeEventListener("message", memoizedHandleMessage);
    };
  }, [memoizedHandleMessage]);

  const handleOpenOtp = () => {
    updateStatus("pending", "OTP verification in progress...");

    const bankOtpUrl = "/thirdparty-bank";

    try {
      window.parent.postMessage(
        {
          type: "OPEN_OTP_POPUP",
          url: bankOtpUrl,
        },
        "*"
      );
    } catch (error) {
      console.error("Failed to post message:", error);
      updateStatus("error", "Failed to open OTP verification");
    }
  };

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
      <h1 className="text-2xl font-semibold mb-4">
        External Deposit App IFrame
      </h1>
      <p className="mb-4 text-gray-700">
        This simulates an external deposit page that can request an OTP popup.
      </p>
      <Button
        type="button"
        onClick={handleOpenOtp}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") handleOpenOtp();
        }}
        variant="primary"
        disabled={status === "pending"}
        loading={status === "pending"}
      >
        {status === "pending" ? "Verifying..." : "Open OTP Popup"}
      </Button>
      <StatusIndicator status={status} message={statusMessage} />
    </main>
  );
};

export default ExternalDepositPage;
